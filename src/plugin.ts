import { ModuleInfo } from "rollup";
import stream from "stream";
import { Plugin } from "vite";
import convert, { ElementCompact } from "xml-js";

import {
  isImage,
  isJsXmlElement,
  isSkipDays,
  isSkipHours,
  isTextInput,
} from "./type-guards";
import { Channel, Item, OptionsDefine, OptionsMeta } from "./types";

export function rssPlugin(opts: OptionsMeta | OptionsDefine): Plugin[] {
  return [devPlugin(opts), buildPlugin(opts)];
}

/**
 * dev mode plugin to serve the xml file
 * @param opts - plugin config options
 */
function devPlugin(opts: OptionsMeta | OptionsDefine): Plugin {
  let items = getItems(opts);
  const fileName = getFileName(opts);

  return {
    name: "rss-plugin-dev",
    enforce: "post",
    apply: "serve",
    configureServer(server) {
      // serve feed.xml on dev server
      server.middlewares.use((req, res, next) => {
        if (
          typeof req.url === "string" &&
          new RegExp(`${fileName}$`).test(req.url)
        ) {
          if (opts.mode === "meta") {
            const devServerModuleIds = Array.from(
              server.moduleGraph.idToModuleMap.keys()
            );
            const moduleInfo = devServerModuleIds.map((id) =>
              server.pluginContainer.getModuleInfo(id)
            );

            items = moduleInfo
              .filter((module): module is ModuleInfo => !!module?.meta.rssItem)
              .map((module) => module.meta.rssItem);
          }

          const renderedXML = createRssFeed(
            opts.channel,
            items ?? [],
            fileName
          );

          const fileContent = Buffer.from(renderedXML, "utf8");
          const readStream = new stream.PassThrough();
          readStream.end(fileContent);
          res.writeHead(200, {
            "Content-Type": "text/xml",
          });
          readStream.pipe(res);
          return;
        }
        next();
      });
    },
  };
}

/**
 * build mode plugin for production builds
 * @param opts - plugin options
 */
function buildPlugin(opts: OptionsMeta | OptionsDefine): Plugin {
  let items = getItems(opts);
  const fileName = getFileName(opts);

  return {
    name: "rss-plugin-build",
    enforce: "post",
    apply: "build",
    buildEnd() {
      if (opts.mode === "meta") {
        const moduleIds = Array.from(this.getModuleIds());
        const moduleInfo = moduleIds.map((id) => this.getModuleInfo(id));
        items = moduleInfo
          .filter((module): module is ModuleInfo => !!module?.meta.rssItem)
          .map((module) => module.meta.rssItem);
      }
      // maybe do another pass for validation w/ zod

      const renderedXML = createRssFeed(opts.channel, items, fileName);

      this.emitFile({
        fileName: fileName,
        name: fileName,
        source: renderedXML,
        type: "asset",
      });
    },
  };
}

function getFileName(opts: OptionsMeta | OptionsDefine): string {
  return opts.fileName ?? "feed.xml";
}

function getItems(opts: OptionsMeta | OptionsDefine): Item[] {
  if (opts.mode === "define") return opts.items;
  return [];
}

function createRssFeed(channel: Channel, items: Item[], fileName: string) {
  // sort by pubDate if available
  const dateSortedRssItems = items.sort((a, b) => {
    if (a.pubDate && b.pubDate) {
      return b.pubDate.getTime() - a.pubDate.getTime();
    }
    if (a.pubDate) {
      return 1;
    }
    if (b.pubDate) {
      return -1;
    }
    return 0;
  });

  // transform rssItems into xml
  // transofmr channel description into xml
  const jsXml = {
    _declaration: { _attributes: { version: "1.0", encoding: "utf-8" } },
    rss: {
      _attributes: {
        version: "2.0",
        "xmlns:atom": "http://www.w3.org/2005/Atom",
      },
      channel: {
        ...channelToXmlJs(channel, fileName),
        item: dateSortedRssItems.map((r) => itemToXmlJs(r)).slice(0, 100),
      },
    },
  };

  // turn collected items into xml
  return convert.js2xml(jsXml, { compact: true, spaces: 2 });
}

function channelToXmlJs(channel: Channel, fileName: string) {
  const jsXml: { [tagName: string]: ElementCompact } = {};
  Object.keys(channel).forEach((tagName) => {
    const value = channel[tagName as keyof Channel];
    if (typeof value === "string" || typeof value === "number") {
      jsXml[tagName] = {
        _text: value,
      };
    } else if (value instanceof Date) {
      jsXml[tagName] = {
        _text: value.toUTCString(),
      };
    } else if (isJsXmlElement(value)) {
      jsXml[tagName] = value;
    } else if (isImage(value) || isTextInput(value)) {
      jsXml[tagName] = {
        ...value,
      };
    } else if (isSkipDays(value)) {
      jsXml[tagName] = {
        day: value.day.map((d) => ({ _text: d })),
      };
    } else if (isSkipHours(value)) {
      jsXml[tagName] = {
        hour: value.hour.map((d) => ({ _text: d })),
      };
    } else if (tagName === "docs" && value) {
      jsXml[tagName] = {
        _text: "https://www.rssboard.org/rss-specification",
      };
    } else if (tagName === "generator" && value) {
      jsXml[tagName] = {
        _text: "vite-plugin-rss",
      };
    }
  });

  const url = new URL(channel.link);
  jsXml["atom:link"] = {
    _attributes: {
      href: `${url.origin}/${fileName}`,
      rel: "self",
      type: "application/rss+xml",
    },
  };
  return jsXml;
}

function itemToXmlJs(item: Item) {
  const jsXml: { [tagName: string]: ElementCompact } = {};

  Object.keys(item).forEach((tagName) => {
    const value = item[tagName as keyof Item];
    if (typeof value === "string" || typeof value === "number") {
      jsXml[tagName] = {
        _text: value,
      };
    } else if (value instanceof Date) {
      jsXml[tagName] = {
        _text: value.toUTCString(),
      };
    } else if (isJsXmlElement(value)) {
      jsXml[tagName] = value;
    }
  });
  return jsXml;
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rssPlugin = void 0;
const stream_1 = __importDefault(require("stream"));
const xml_js_1 = __importDefault(require("xml-js"));
const type_guards_1 = require("./type-guards");
function rssPlugin(opts) {
    var _a;
    const fileName = (_a = opts.fileName) !== null && _a !== void 0 ? _a : "feed.xml";
    let items;
    let renderedXML = "";
    if (opts.mode === "define") {
        items = opts.items;
    }
    return {
        name: "rss-plugin",
        generateBundle(_options, bundle) {
            if (!items && opts.mode === "meta") {
                items = Array.from(this.getModuleIds())
                    .map((id) => this.getModuleInfo(id))
                    .filter((module) => !!(module === null || module === void 0 ? void 0 : module.meta.rssItem))
                    .map((module) => module.meta.rssItem);
            }
            // maybe do another pass for validation w/ zod
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
                    channel: Object.assign(Object.assign({}, channelToXmlJs(opts.channel, fileName)), { item: dateSortedRssItems.map((r) => itemToXmlJs(r)) }),
                },
            };
            // turn collected items into xml
            renderedXML = xml_js_1.default.js2xml(jsXml, { compact: true, spaces: 2 });
            // add to the bundle
            bundle[fileName] = {
                fileName: fileName,
                name: fileName,
                source: renderedXML,
                type: "asset",
                isAsset: true,
            };
        },
        configureServer(server) {
            // serve feed.xml on dev server
            server.middlewares.use((req, res, next) => {
                var _a;
                if (/feed\.xml$/.test((_a = req.url) !== null && _a !== void 0 ? _a : "")) {
                    const fileContent = Buffer.from(renderedXML, "utf8");
                    const readStream = new stream_1.default.PassThrough();
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
exports.rssPlugin = rssPlugin;
function channelToXmlJs(channel, fileName) {
    const jsXml = {};
    Object.keys(channel).forEach((tagName) => {
        const value = channel[tagName];
        if (typeof value === "string" || typeof value === "number") {
            jsXml[tagName] = {
                _text: value,
            };
        }
        else if (value instanceof Date) {
            jsXml[tagName] = {
                _text: value.toUTCString(),
            };
        }
        else if ((0, type_guards_1.isJsXmlElement)(value)) {
            jsXml[tagName] = value;
        }
        else if ((0, type_guards_1.isImage)(value) || (0, type_guards_1.isTextInput)(value)) {
            jsXml[tagName] = Object.assign({}, value);
        }
        else if ((0, type_guards_1.isSkipDays)(value)) {
            jsXml[tagName] = {
                day: value.day.map((d) => ({ _text: d })),
            };
        }
        else if ((0, type_guards_1.isSkipHours)(value)) {
            jsXml[tagName] = {
                hour: value.hour.map((d) => ({ _text: d })),
            };
        }
        else if (tagName === "docs" && value) {
            jsXml[tagName] = {
                _text: "https://www.rssboard.org/rss-specification",
            };
        }
        else if (tagName === "generator" && value) {
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
function itemToXmlJs(item) {
    const jsXml = {};
    Object.keys(item).forEach((tagName) => {
        const value = item[tagName];
        if (typeof value === "string" || typeof value === "number") {
            jsXml[tagName] = {
                _text: value,
            };
        }
        else if (value instanceof Date) {
            jsXml[tagName] = {
                _text: value.toUTCString(),
            };
        }
        else if ((0, type_guards_1.isJsXmlElement)(value)) {
            jsXml[tagName] = value;
        }
    });
    return jsXml;
}

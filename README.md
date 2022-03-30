# RSS Plugin

Create an RSS feed from an SPA at bundle time.

## Installation

```
yarn add -D vite-plugin-rss
```

```
npm install -D vite-plugin-rss
```

## Usage

Plugin Options:

```typescript
interface Options {
  channel: Channel; // RSS channel xml config
  fileName?: string; // RSS xml file output name, defaults to 'feed.xml'
  mode: "meta" | "define"; // the mode to use for item generation
  itmes?: Item[]; // statically defined items in 'define' mode
}
```

This plugin can run in two modes: `'meta'` or `'define'`.

### `'define'` mode

In `'define'` mode, you define your RSS items in the configuration of the
plugin.

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { rssPlugin } from "vite-plugin-rss";

export default defineConfig({
  plugins: [
    rssPlugin({
      mode: "define",
      items: [
        {
          title: "Second Post",
          link: "http://lvh.me:3000/test/2",
          pubDate: new Date("1/1/2000"),
        },
        {
          title: "First Post",
          link: "http://lvh.me:3000/test/1",
          pubDate: new Date("1/1/1990"),
        },
      ],
      channel: {
        title: "Test RSS Feed",
        link: "http://lvh.me:3000",
        description: "Test rss feed for vite-plugin-rss.",
      },
    }),
  ],
  build: {
    outDir: "dist_test",
  },
});
```

### `'meta'` mode

`'meta'` mode will look for rss items by examining module info from another
plugin's transform or load step.

```javascript
// vite.config.ts
import { defineConfig } from "vite";
import { rssPlugin } from "vite-plugin-rss";

export default defineConfig({
  plugins: [
    myPlugin(),
    rssPlugin({
      mode: "meta",
      channel: {
        title: "Test RSS Feed",
        link: "http://lvh.me:3000",
        description: "Test rss feed for vite-plugin-rss.",
      },
    }),
  ],
  build: {
    outDir: "dist_test",
  },
});

function myPlugin() {
  return {
    name: "my-plugin",
    load(id) {
      if (id.includes("post-1")) {
        return {
          meta: {
            rssItem: {
              title: "First Post",
              link: "http://lvh.me:3000/test/1",
              pubDate: new Date("1/1/1990"),
            },
          },
        };
      }

      if (id.includes("post-2")) {
        return {
          meta: {
            rssItem: {
              title: "Second Post",
              link: "http://lvh.me:3000/test/2",
              pubDate: new Date("1/1/2000"),
            },
          },
        };
      }
    },
  };
}
```

The output will look something like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Test RSS Feed</title>
    <link>http://lvh.me:3000</link>
    <description>Test rss feed for vite-plugin-rss.</description>
    <atom:link href="http://lvh.me:3000/feed.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>Second Post</title>
      <link>http://lvh.me:3000/test/2</link>
      <pubDate>Sat, 01 Jan 2000 07:00:00 GMT</pubDate>
    </item>
    <item>
      <title>First Post</title>
      <link>http://lvh.me:3000/test/1</link>
      <pubDate>Mon, 01 Jan 1990 07:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
```

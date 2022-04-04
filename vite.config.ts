import { defineConfig, Plugin } from "vite";

import { rssPlugin } from "./src";

const metaTestPlugin: Plugin = {
  name: "meta-test-plugin",
  transform(_code, id) {
    if (id.includes("index")) {
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
    return null;
  },
};

export default defineConfig({
  plugins: [
    metaTestPlugin,
    rssPlugin({
      mode: "meta",
      channel: {
        title: "META: Test RSS Feed",
        link: "http://lvh.me:3000",
        description: "Test rss feed for vite-plugin-rss.",
      },
      fileName: "meta.xml",
    }),
    // rssPlugin({
    //   mode: "define",
    //   items: [
    //     {
    //       title: "Second Post",
    //       link: "http://lvh.me:3000/test/2",
    //       pubDate: new Date("1/1/2000"),
    //     },
    //     {
    //       title: "First Post",
    //       link: "http://lvh.me:3000/test/1",
    //       pubDate: new Date("1/1/1990"),
    //     },
    //   ],
    //   channel: {
    //     title: "DEFINE: Test RSS Feed",
    //     link: "http://lvh.me:3000",
    //     description: "Test rss feed for vite-plugin-rss.",
    //   },
    //   fileName: "define.xml",
    // }),
  ],
  build: {
    outDir: "dist_test",
  },
});

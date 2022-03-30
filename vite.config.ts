import { defineConfig } from "vite";
import { rssPlugin } from "./src";

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

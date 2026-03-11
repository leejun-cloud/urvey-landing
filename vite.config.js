import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // GitHub Pages 배포 시 레포지토리 이름과 일치해야 함
  base: "/urvey-landing/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
      },
    },
  },
});

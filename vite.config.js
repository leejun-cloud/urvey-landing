import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

// A simple plugin to replace %ENV_VARS% in HTML files
const htmlEnvPlugin = () => {
  let config;
  return {
    name: 'html-transform',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml(html) {
      const env = loadEnv(config.mode, process.cwd(), '');
      return html.replace(/%([\w]+)%/g, (match, key) => {
        return process.env[key] || env[key] || match;
      });
    }
  };
};

export default defineConfig({
  // GitHub Pages 배포 시 레포지토리 이름과 일치해야 함
  base: "/urvey-landing/",
  plugins: [htmlEnvPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
      },
    },
  },
});

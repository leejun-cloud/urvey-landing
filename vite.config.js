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
  // Vercel 배포 - 루트 경로 사용
  base: "/",
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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/platform/",
    plugins: [react()],
    build: {
        manifest: true,
        cssMinify: true
    },
    server: {
        port: 3001,
        proxy: {
            "/platform/api/v1": {
                target: "http://localhost:9089/",
                changeOrigin: true
            }
        }
    }
});

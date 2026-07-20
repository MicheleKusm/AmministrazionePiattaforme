import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/",
    plugins: [react()],
    build: {
        manifest: true,
        cssMinify: true
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:9089/platform",
                changeOrigin: true
            }
        }
    }
});

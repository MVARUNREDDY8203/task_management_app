import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "../client",
    },
    base: "./", // VERY IMPORTANT — makes all assets use relative paths
});

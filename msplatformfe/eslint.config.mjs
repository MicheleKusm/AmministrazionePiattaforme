import { defineConfig } from "eslint/config"
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"

export default defineConfig([
    // Global ignores
    {
        ignores: ["test-report", "public", "**/external-uikit/**"]
    },
    // JS/TS files configuration (combined)
    {
        files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: globals.browser
        }
    },
    // TypeScript specific rules
    tseslint.configs.recommended,
    // Override TypeScript rules
    {
        files: ["src/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn"
        }
    },
    // Disable TypeScript rules for JS/JSX files
    {
        files: ["src/**/*.{js,jsx}"],
        rules: {
            "@typescript-eslint/no-unused-vars": "off"
        }
    },
    // React JSX runtime config
    pluginReact.configs.flat["jsx-runtime"]
])

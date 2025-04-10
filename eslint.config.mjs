import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("next/core-web-vitals"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "import/no-unresolved": "off",
        "import/named": "off",
        "no-console": "warn",
        "react-hooks/exhaustive-deps": "warn",
    },
}]);
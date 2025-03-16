import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        // Add custom rules here
        rules: {
            "react/no-unescaped-entities": "off", // Disable the rule globally
            "@next/next/no-html-link-for-pages": "off", // Disable the warning about using <a> for navigation
            "@typescript-eslint/no-explicit-any": "off", // Disable the explicit any warning
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Disable unused vars but allow unused function arguments (e.g., _e)
        },
    },
];

export default eslintConfig;
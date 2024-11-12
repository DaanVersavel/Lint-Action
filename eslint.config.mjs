import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    // Ignore specific files and directories
    ignores: [
      "eslint.config.mjs",
      "node_modules/",
      "tsconfig.json",
      "dist/",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Add any custom rules here
      '@typescript-eslint/no-require-imports': 'off'
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
];

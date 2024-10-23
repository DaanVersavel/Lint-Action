import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { rules } from "@eslint/js/src/configs/eslint-all";


export default [
  {
    // Need to be in different object for some reason. See https://github.com/eslint/eslint/issues/17400
    ignores: ['eslint.config.mjs', 'node_modules/', 'tsconfig.json', 'dist/index.js'],
  },
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser },
  rules: {
    // Disables no null assertion
    '@typescript-eslint/no-require-imports': 'off',
  }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
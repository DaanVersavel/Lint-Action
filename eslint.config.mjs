import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    // Ignore specific files and directories
    ignores: ["eslint.config.mjs", "node_modules/", "tsconfig.json", "dist/"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@stylistic": stylistic,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Add any custom rules here
      "@typescript-eslint/no-require-imports": "off",

      // Stylistic
      // Enforce that lines end with a semicolon
      "@stylistic/semi": ["error", "always"],
      // Disallow spaces inside of brackets
      "@stylistic/array-bracket-spacing": "error",
      // Enforce one true brace style
      "@stylistic/brace-style": "error",
      // Enforce spaces around operators (e.g. 1 + 2 instead of 1+2)
      "@stylistic/space-infix-ops": "error",
      // Enforce space after comma
      "@stylistic/comma-spacing": "error",
      // Enforce spacing before
      "@stylistic/space-before-blocks": ["error", "always"],
      // Disallow trailing commas
      "@stylistic/comma-dangle": ["error", "never"],
      // Enforce space inside of code blocks
      "@stylistic/block-spacing": ["error", "always"],
      // Disallow spaces after opening and before closing parentheses
      "@stylistic/space-in-parens": ["error", "never"],
      // Disallow spaces before function parentheses
      "@stylistic/space-before-function-paren": ["error", "never"],
      // Disallow multiple spaces
      "@stylistic/no-multi-spaces": "error",
      // Enforce spaces after unary operator that is a word (e.g. delete), but disallow space when the operator is not a word (e.g. ++)
      "@stylistic/space-unary-ops": [
        "error",
        {
          words: true,
          nonwords: false,
        },
      ],
      // Enforce space before and after keywords (e.g. if () {} else {})
      "@stylistic/keyword-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],
      // Allow the Ternary option
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
];

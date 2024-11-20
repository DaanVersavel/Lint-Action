import * as core from '@actions/core';
const eslint = require("./linters/eslint");
// const { getContext } = require("./github/context");

// Main function to run ESLint
async function runLint(): Promise<void> {
  try {
    // Get inputs from the workflow
    const extensions = core.getInput('eslint_extensions');
    const autoFix = core.getInput('auto_fix') === 'true';
    // const context = getContext();

    // Check if ESLint version is 9 or higher
    eslint.checkEslintVersion();

    // Run ESLint and capture output
    const eslintOutput = eslint.lint(extensions, autoFix);

    const lintResult = eslint.parseOutput(eslintOutput);



    if (!lintResult.isSuccess) {
      core.setFailed('ESLint found errors.');
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed: ${error.message}`);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

runLint();
import * as core from '@actions/core';
const eslint = require("./linters/eslint");
const { checkoutBranch } = require("./git");

// Main function to run ESLint
async function runLint(): Promise<void> {
  
  // Decalre variables
  const extensions = core.getInput('eslint_extensions');
  const autoFix = core.getInput('auto_fix') === 'true';

  // Setup
  checkoutBranch();

  // Check if ESLint version is 9 or higher
  eslint.checkEslintVersion();

  // Run ESLint and capture output
  const eslintOutput = eslint.lint(extensions, autoFix);

  const lintResult = eslint.parseOutput(eslintOutput);

  console.log(core);


  if (!lintResult.isSuccess) {
    core.setFailed('ESLint found errors.');
  }
}

runLint();
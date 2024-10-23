import * as core from '@actions/core';
const {commandExists, runCli} = require("utils");


// Function to check ESLint version
async function checkEslintVersion(): Promise<void> {
  // Verify that NPM is installed (required to execute ESLint)
  if (!(await commandExists("npm"))) {
    throw new Error("NPM is not installed");
  }
  // Verify that ESLint is installed
  try {
    runCli('npx eslint -v');
  } catch (err) {
    core.debug(String(err));
    throw new Error('Eslint is not installed');
  }

}

// Function to parse ESLint JSON output and create GitHub annotations
function createAnnotations(eslintOutput: string): void {
  const results = JSON.parse(eslintOutput);
  results.forEach((result: any) => {
    const filePath = result.filePath;
    result.messages.forEach((message: any) => {
      const line = message.line;
      const column = message.column;
      const ruleId = message.ruleId;
      const severity = message.severity;
      const eslintMessage = message.message;

      if (severity === 2) {
        // Severity 2 is an error
        core.error(`${eslintMessage} (${ruleId})`, {
          file: filePath,
          startLine: line,
          startColumn: column,
        });
      } else {
        // Severity 1 is a warning
        core.warning(`${eslintMessage} (${ruleId})`, {
          file: filePath,
          startLine: line,
          startColumn: column,
        });
      }
    });
  });
}

// Main function to run ESLint
async function runLint(): Promise<void> {
  try {
    // Get inputs from the workflow
    const extensions = core.getInput('eslint_extensions') || 'js,ts';
    const autoFix = core.getInput('auto_fix') === 'true';

    // Check if ESLint version is 9 or higher
    checkEslintVersion();

    // Build the ESLint command
    /*     let command = `eslint . --ext ${extensions} --format json`;
        if (autoFix) {
          command += ' --fix';
        }
    
        // Run ESLint and capture output
        const eslintOutput = runCommand(command);
    
        // Create annotations from the ESLint output
        // createAnnotations(eslintOutput);
    
        // Fail the action if there are any ESLint errors
        const results = JSON.parse(eslintOutput);
        const hasErrors = results.some((result: any) => result.errorCount > 0);
        if (hasErrors) {
          core.setFailed('ESLint found errors.');
        } */
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed: ${error.message}`);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

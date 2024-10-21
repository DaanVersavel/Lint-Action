import { execSync } from 'child_process';
import * as core from '@actions/core';

// Function to execute shell commands and return the output
function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8' });
  } catch (error) {
    core.setFailed(`Command failed: ${error}`);
    return '';
  }
}

// Function to check ESLint version
function checkEslintVersion(requiredVersion: string): void {
  const installedVersion = runCommand('eslint --version').trim();
  if (parseFloat(installedVersion.split('v')[1]) < parseFloat(requiredVersion)) {
    core.setFailed(`Error: ESLint version ${requiredVersion} or higher is required. Found ${installedVersion}`);
    process.exit(1);
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
    checkEslintVersion('9.0.0');

    // Build the ESLint command
    let command = `eslint . --ext ${extensions} --format json`;
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
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed: ${error.message}`);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

// Run the linting action
runLint();

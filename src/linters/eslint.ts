const { initLintResult } = require("../lint-result");
const {runCli, commandExists, removeTrailingPeriod} = require("../utils");
import { outputType } from '../utils';


/** @typedef {import('../utils/lint-result').LintResult} LintResult */

/**
 * https://eslint.org
 */
class ESLint {
    /**
     * Verifies that all required programs are installed. Throws an error if programs are missing
     */
    static async checkEslintVersion(): Promise<void> {
        // Verify that NPM is installed (required to execute ESLint)
        if (!(await commandExists("npm"))) {
            throw new Error("NPM is not installed");
        }
        // Verify that ESLint is installed
        try {
            runCli('eslint -v', 'npx');
        } catch (err) {
            throw new Error('Eslint is not installed:' + err);
        }

    }

    /**
     * Runs the linting program and returns the command output
     * @param {string} dir - Directory to run the linter in
     * @param {string[]} extensions - File extensions which should be linted
     * @param {string} args - Additional arguments to pass to the linter
     * @param {boolean} fix - Whether the linter should attempt to fix code style issues automatically
     * @param {string} prefix - Prefix to the lint command
     * @returns {{status: number, stdout: string, stderr: string}} - Output of the lint command
     */
    static lint(extensions: string, autoFix: string) {

        let command = `eslint "**/*.${extensions}" --format json`;
        if (autoFix) {
          command += ' --fix';
        }
        return runCli(command, 'npx');
    }

    /**
     * Parses the output of the lint command. Determines the success of the lint process and the
     * severity of the identified code style violations
     * @param {string} dir - Directory in which the linter has been run
     * @param {{status: number, stdout: string, stderr: string}} output - Output of the lint command
     * @returns {lintResultType} - Parsed lint result
     */
    static parseOutput(output: outputType) {
        const lintResult = initLintResult();
        lintResult.isSuccess = output.status === 0;

        let outputJson;
        try {
            outputJson = JSON.parse(output.stdout);
        } catch (err: unknown) {
            throw Error(
                `Error parsing ${this.name} JSON output: ${err}. Output: "${output.stdout}"`
            );
        }

        for (const violation of outputJson) {
            const { messages, fixableErrorCount } = violation;
            // const path = filePath.substring(dir.length + 1);
            lintResult.fixable = lintResult.fixable || !!fixableErrorCount; 

            for (const msg of messages) {
                const { fatal, line, message, ruleId, severity } = msg;

                // Exit if a fatal ESLint error occurred
                if (fatal) {
                    throw Error(`ESLint error: ${message}`);
                }

                const entry = {
                    // path,
                    firstLine: line,
                    lastLine: line,
                    message: `${removeTrailingPeriod(message)} (${ruleId})`
                };
                if (severity === 1) {
                    lintResult.warning.push(entry);
                } else if (severity === 2) {
                    lintResult.error.push(entry);
                }
            }
        }

        return lintResult;
    }
}

module.exports = ESLint;

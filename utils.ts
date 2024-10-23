import { execSync } from "child_process";

const core = require("@actions/core");
const checkForCommand = require("command-exists");



/**
 * Returns whether the provided shell command is available
 * @param {string} command - Shell command to check for
 * @returns {Promise<boolean>} - Whether the command is available
 */
async function commandExists(command: string) {
	// The `command-exists` library throws an error if the command is not available. This function
	// catches these errors and returns a boolean value instead
	try {
		await checkForCommand(command);
		return true;
	} catch (error) {
		console.log(`Check for command gave following error: ${error}`);
		return false;
	}
}

/**
 * Executes the provided shell command
 * @param {string} cmd - Shell command to execute
 * @returns {{status: number, stdout: string, stderr: string}} - Output of the shell command
 */
function runCli(cmd: string) {

	core.debug('HEEEELO'+cmd);

	try {
		const stdout = execSync(cmd, {
			encoding: "utf8",
			maxBuffer: 20 * 1024 * 1024,
		});
		const output = {
			status: 0,
			stdout: stdout.trim(),
			stderr: "",
		};

		core.debug(`Stdout: ${output.stdout}`);

		return output;
	} catch (err: any) {

		core.debug(`Exit code: ${err.status}`);
		core.debug(`Stdout: ${err.stdout.trim()}`);
		core.debug(`Stderr: ${err.stderr.trim()}`);
		throw new Error();
	}
}

module.exports = {
    commandExists,
    runCli
}
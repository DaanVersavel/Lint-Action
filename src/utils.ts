import { execSync } from "child_process";

const core = require("@actions/core");
const checkForCommand = require("command-exists");

export type outputType = {
	status: number;
	stdout: string
	stderr: string
};

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
function runCli(cmd: string, prefix: string): outputType {
	if (prefix === undefined) {
		throw new Error('prefix is required');
	}

	core.info(cmd);
	const commandCli: string = `${prefix} ${cmd}`;
	const output: outputType = {
		status: 0,
		stdout: "",
		stderr: ""
	};

	try {
		const stdout = execSync(commandCli, {
			encoding: "utf8",
			maxBuffer: 20 * 1024 * 1024
		});

		output.status = 0;
		output.stdout = stdout.trim();
		output.stderr = "";

		return output;
	} catch (err) {
		if (typeof err === 'object' && err !== null) {
			if ('status' in err && 'stdout' in err && 'stderr' in err) {
				output.status = err.status as number;
				output.stdout = (err.stdout as string).trim();
				output.stderr = (err.stderr as string).trim();
			}
		}
		return output;
	}
}

/**
 * Removes the trailing period from the provided string (if it has one)
 * @param {string} str - String to process
 * @returns {string} - String without trailing period
 */
function removeTrailingPeriod(str: string) {
	return str[str.length - 1] === "." ? str.substring(0, str.length - 1) : str;
}


module.exports = {
	commandExists,
	runCli,
	removeTrailingPeriod
};
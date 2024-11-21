import * as core from '@actions/core';
const {runCli} = require("./utils");

/**
 * Checks out a branch on GitHub, adding the access token to the clone URL and setting the branch to track the remote one.
 * @param {Context} context - The GitHub context from the Actions API.
 */
function checkoutBranch(context: { repository: { cloneUrl: string | URL; }; actor: string; token: string; branch: unknown; }) {
    core.info(`Adding auth information to Git remote URL`);
    const cloneURl = new URL(context.repository.cloneUrl);

	core.info(`Context` + context);
	core.debug(`Context` + context);
    cloneURl.username = context.actor;
    cloneURl.password = context.token;
    runCli(`git remote set-url origin ${cloneURl.toString()}`);

	// Fetch remote branch
	core.info(`Fetching remote branch "${context.branch}"`);
	runCli(`git fetch --no-tags --depth=1 origin ${context.branch}`);

	// Switch to remote branch
	core.info(`Switching to the "${context.branch}" branch`);
	runCli(`git branch --force ${context.branch} --track origin/${context.branch}`);
	runCli(`git checkout ${context.branch}`);
}


module.exports = {
    checkoutBranch
};
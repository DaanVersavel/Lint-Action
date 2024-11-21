import * as core from '@actions/core';
const { runCli } = require("./utils");
import * as github from '@actions/github';

/**
 * Checks out a branch on GitHub, adding the access token to the clone URL and setting the branch to track the remote one.
 * @param {Context} context - The GitHub context from the Actions API.
 */
function checkoutBranch() {
	const context = github.context;
	const branch = context.payload.pull_request?.head.ref;

	core.info(`Adding auth information to Git`);
	runCli(`config --global user.email "action@user.com"`, 'git');
	runCli(`config --global user.name "action user"`, 'git');

	core.info(`Fetch remote branches`);
	runCli(`fetch origin ${branch}`, 'git');

	core.info(`Checkout pull request branch`);
	runCli(`checkout -t origin/${branch}`, 'git');
}


/**
 * Commits all changes (if any) and pushes them to the remote.
 */
function pushChanges() {
	core.info(`Create fix commit`);
	runCli('commit -m "Fix eslint issues" --allow-empty', 'git');

	core.info(`Push changes`);
	runCli('push', 'git');
}


module.exports = {
	checkoutBranch,
	pushChanges
};
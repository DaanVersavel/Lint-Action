import * as core from '@actions/core';
import { runCli } from './utils';
import * as github from '@actions/github';

/**
 * Checks out a branch on GitHub, adding the access token to the clone URL and setting the branch to track the remote one.
 * @param {Context} context - The GitHub context from the Actions API.
 */
export function checkoutBranch() {
	const context = github.context;
	const branch = context.payload.pull_request?.head.ref;

	core.info(`Adding auth information to Git`);
	runCli(`config --global user.email "action@user.com"`, 'git');
	runCli(`config --global user.name "action user"`, 'git');

	core.info(`Fetch remote branchs`);
	runCli(`fetch origin ${branch}`, 'git');

	core.info(`Checkout pull request branch`);
	runCli(`checkout -t origin/${branch}`, 'git');
}


/**
 * Checks if there are any changes in the working directory.
 * @returns {boolean} - The status code indicating the presence of changes (0 if no changes, non-zero if changes exist).
 */
export function hasChanges() {
	const output = runCli('diff-index --name-status --exit-code HEAD --', 'git');
	return !!output.status === true;
}

/**
 * Commits all changes (if any) and pushes them to the remote.
 */
export function pushChanges() {
	core.info(`Create fix commit`);
	runCli('commit . -m "Fix eslint issues"', 'git');

	core.info(`Push changes`);
	runCli('push', 'git');
}
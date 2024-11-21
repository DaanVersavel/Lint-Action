import * as core from '@actions/core';
const {runCli} = require("./utils");
import * as github from '@actions/github';

/**
 * Checks out a branch on GitHub, adding the access token to the clone URL and setting the branch to track the remote one.
 * @param {Context} context - The GitHub context from the Actions API.
 */
function checkoutBranch() {
	const context = github.context;
    core.info(`Adding auth information to Git remote URL`);
    // const cloneURl = new URL(context.repository.cloneUrl);

	const url = context.payload.pull_request?.head.ref;
	core.debug(`Context ` + url);
	
	
/* 	cloneURl.username = context.actor;
    cloneURl.password = context.token; */
    runCli(`fetch origin ${url}`, 'git');
    runCli(`config --global user.email "action@user.com"`, 'git');
    runCli(`config --global user.name "action user"`, 'git');
    runCli(`fetch origin ${url}`, 'git');

    runCli('commit -m "[GEN] retrigger checks" --allow-empty', 'git');
    runCli('push', 'git');

	core.info(`Successfully checked out branch: ${url}`);
	// Fetch remote branch
/* 	core.info(`Fetching remote branch "${context.branch}"`);
	runCli(`git fetch --no-tags --depth=1 origin ${context.branch}`);

	// Switch to remote branch
	core.info(`Switching to the "${context.branch}" branch`);
	runCli(`git branch --force ${context.branch} --track origin/${context.branch}`);
	runCli(`git checkout ${context.branch}`); */
}


module.exports = {
    checkoutBranch
};
import {existsSync} from 'fs';
import {setOutput} from '@actions/core';
import {Context} from '@actions/github/lib/context';
import {Octokit} from '@technote-space/github-action-helper/dist/types';
import {Utils, ApiHelper, ContextHelper} from '@technote-space/github-action-helper';
import {Logger} from '@technote-space/github-action-log-helper';
import {ReplaceResult, replaceInFile} from 'replace-in-file';
import {
  getPackageVersionToUpdate,
  getReplaceResultMessages,
  getCommitMessage,
  getDefaultBranch,
  isCommitDisabled,
  getTagName,
  getBranch,
  findAutoloadFile,
} from './misc';
import {getBranchesByTag} from './command';
import {REPLACE_RULES} from '../constant';

export const updatePackageVersion = async(logger: Logger, context: Context): Promise<Array<string>> => {
  logger.startProcess('Updating package version...');

  const tagName  = getTagName(context);
  const version  = getPackageVersionToUpdate(tagName);
  const autoload = findAutoloadFile(Utils.getWorkspace());
  const results  = await REPLACE_RULES.reduce(async(prev, rule) => {
    const acc    = await prev;
    const config = rule(version, autoload);
    if (!existsSync(config.file)) {
      return acc;
    }
    return acc.concat(await replaceInFile({...config, files: config.file}));
  }, Promise.resolve([] as Array<ReplaceResult>));

  logger.displayStdout(getReplaceResultMessages(results, logger));

  return results.filter(item => item.hasChanged).map(item => item.file);
};

export const getUpdateBranch = async(logger: Logger, context: Context): Promise<string | false> => {
  const tagName = ContextHelper.getTagName(context);
  if (tagName) {
    const branch = getDefaultBranch(context);
    if (undefined === branch) {
      logger.warn('Failed to get default branch name.');
      return false;
    }

    if (!(await getBranchesByTag(tagName)).includes(branch)) {
      logger.info('This is not default branch.');
      return false;
    }
    return branch;
  }

  return getBranch(context);
};

export const commit = async(files: Array<string>, logger: Logger, octokit: Octokit, context: Context): Promise<boolean> => {
  if (!files.length) {
    logger.info('No need to update.');
    return true;
  }

  logger.startProcess('Committing...');
  if (isCommitDisabled()) {
    logger.info('Commit is disabled.');
    return true;
  }

  const branch = await getUpdateBranch(logger, context);
  if (false === branch) {
    return false;
  }

  const helper = new ApiHelper(octokit, context, logger, {
    branch: branch,
    refForUpdate: `heads/${branch}`,
    suppressBPError: true,
  });
  await helper.commit(Utils.getWorkspace(), getCommitMessage(), files);
  setOutput('sha', process.env.GITHUB_SHA + '');
  return true;
};

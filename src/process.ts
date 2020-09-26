import {Context} from '@actions/github/lib/context';
import {Octokit} from '@technote-space/github-action-helper/dist/types';
import {Utils} from '@technote-space/github-action-helper';
import {Logger} from '@technote-space/github-action-log-helper';
import {updatePackageVersion, commit} from './utils/package';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<boolean> => commit(await updatePackageVersion(logger, context), logger, Utils.getOctokit(), context);

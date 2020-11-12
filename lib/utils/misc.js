"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAutoloadFile = exports.isValidContext = exports.isValidBranchContext = exports.isValidTagNameContext = exports.getTagName = exports.isSpecifiedNextVersion = exports.getNextVersion = exports.getBranch = exports.getDefaultBranch = exports.isCommitDisabled = exports.getCommitMessage = exports.getReplaceResultMessages = exports.isValidTagName = exports.getPackageVersionToUpdate = exports.getTestTag = exports.isTestTag = exports.getTestTagPrefix = exports.isValidBranch = exports.getBranchPrefix = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const core_1 = require("@actions/core");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const { isValidSemanticVersioning, getBoolValue, getPrefixRegExp } = github_action_helper_1.Utils;
const normalizeVersion = (version) => { var _a; return (_a = github_action_helper_1.Utils.normalizeVersion(version, { fill: false, cut: false })) !== null && _a !== void 0 ? _a : ''; };
exports.getBranchPrefix = () => core_1.getInput('BRANCH_PREFIX');
const getBranchPrefixRegExp = () => getPrefixRegExp(exports.getBranchPrefix());
const getVersionFromBranch = (branch) => branch.replace(getBranchPrefixRegExp(), '');
exports.isValidBranch = (branch) => !!exports.getBranchPrefix() && getBranchPrefixRegExp().test(branch) && isValidSemanticVersioning(getVersionFromBranch(branch));
exports.getTestTagPrefix = () => core_1.getInput('TEST_TAG_PREFIX');
const getTestTagPrefixRegExp = () => getPrefixRegExp(exports.getTestTagPrefix());
exports.isTestTag = (tagName) => !!exports.getTestTagPrefix() && getTestTagPrefixRegExp().test(tagName);
exports.getTestTag = (tagName) => tagName.replace(getTestTagPrefixRegExp(), '');
exports.getPackageVersionToUpdate = (tagName) => normalizeVersion(exports.isTestTag(tagName) ? exports.getTestTag(tagName) : tagName);
exports.isValidTagName = (tagName) => isValidSemanticVersioning(exports.getPackageVersionToUpdate(tagName));
exports.getReplaceResultMessages = (results, logger) => results.map(result => `${result.hasChanged ? logger.c('✔', { color: 'green' }) : logger.c('✖', { color: 'red' })} ${result.file}`);
exports.getCommitMessage = () => core_1.getInput('COMMIT_MESSAGE', { required: true });
exports.isCommitDisabled = () => getBoolValue(core_1.getInput('COMMIT_DISABLED'));
exports.getDefaultBranch = (context) => context.payload.repository ? context.payload.repository.default_branch : undefined;
exports.getBranch = (context) => github_action_helper_1.ContextHelper.isPr(context) ? github_action_helper_1.Utils.getPrBranch(context) : github_action_helper_1.Utils.getBranch(context);
exports.getNextVersion = () => {
    const version = core_1.getInput('NEXT_VERSION');
    if (exports.isValidTagName(version)) {
        return version;
    }
    return '';
};
exports.isSpecifiedNextVersion = () => !!exports.getNextVersion();
exports.getTagName = (context) => {
    const nextVersion = exports.getNextVersion();
    if (nextVersion) {
        return nextVersion;
    }
    const tagName = github_action_helper_1.ContextHelper.getTagName(context);
    if (tagName) {
        return tagName;
    }
    return getVersionFromBranch(exports.getBranch(context));
};
exports.isValidTagNameContext = (context) => exports.isValidTagName(github_action_helper_1.ContextHelper.getTagName(context));
exports.isValidBranchContext = (context) => exports.isValidBranch(exports.getBranch(context));
exports.isValidContext = (context) => exports.isSpecifiedNextVersion() || exports.isValidTagNameContext(context) || exports.isValidBranchContext(context);
exports.findAutoloadFile = (workDir) => {
    const result = fs_1.readdirSync(workDir, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && /\.php$/.test(dirent.name))
        .map(({ name }) => path_1.join(workDir, name))
        .find(path => /Version\s*:\s*v?\d+(\.\d+)*$/m.test(fs_1.readFileSync(path, { encoding: 'utf-8' })));
    if (!result) {
        throw new Error('Autoload file not found.');
    }
    return result.replace(getPrefixRegExp(workDir), '').replace(/^\//, '');
};
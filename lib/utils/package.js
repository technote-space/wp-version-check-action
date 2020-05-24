"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commit = exports.getUpdateBranch = exports.updatePackageVersion = void 0;
const fs_1 = require("fs");
const core_1 = require("@actions/core");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const replace_in_file_1 = __importDefault(require("replace-in-file"));
const misc_1 = require("./misc");
const command_1 = require("./command");
const constant_1 = require("../constant");
exports.updatePackageVersion = (logger, context) => __awaiter(void 0, void 0, void 0, function* () {
    logger.startProcess('Updating package version...');
    const tagName = misc_1.getTagName(context);
    const version = misc_1.getPackageVersionToUpdate(tagName);
    const autoload = misc_1.findAutoloadFile(github_action_helper_1.Utils.getWorkspace());
    const results = yield constant_1.REPLACE_RULES.reduce((prev, rule) => __awaiter(void 0, void 0, void 0, function* () {
        const acc = yield prev;
        const config = rule(version, autoload);
        if (!fs_1.existsSync(config.file)) {
            return acc;
        }
        return acc.concat(yield replace_in_file_1.default(Object.assign(Object.assign({}, config), { files: config.file })));
    }), Promise.resolve([]));
    logger.displayStdout(misc_1.getReplaceResultMessages(results));
    return results.filter(item => item.hasChanged).map(item => item.file);
});
exports.getUpdateBranch = (logger, context) => __awaiter(void 0, void 0, void 0, function* () {
    const tagName = github_action_helper_1.ContextHelper.getTagName(context);
    if (tagName) {
        const branch = misc_1.getDefaultBranch(context);
        if (undefined === branch) {
            logger.warn('Failed to get default branch name.');
            return false;
        }
        if (!(yield command_1.getBranchesByTag(tagName)).includes(branch)) {
            logger.info('This is not default branch.');
            return false;
        }
        return branch;
    }
    return misc_1.getBranch(context);
});
exports.commit = (files, logger, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (!files.length) {
        logger.info('No update required.');
        return true;
    }
    logger.startProcess('Committing...');
    if (misc_1.isCommitDisabled()) {
        logger.info('Commit is disabled.');
        return true;
    }
    const branch = yield exports.getUpdateBranch(logger, context);
    if (false === branch) {
        return false;
    }
    const helper = new github_action_helper_1.ApiHelper(octokit, context, logger, { branch: branch, refForUpdate: `heads/${branch}`, suppressBPError: true });
    yield helper.commit(github_action_helper_1.Utils.getWorkspace(), misc_1.getCommitMessage(), files);
    core_1.setOutput('sha', process.env.GITHUB_SHA + '');
    return true;
});

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const github_action_helper_1 = require("@technote-space/github-action-helper");
const package_1 = require("./utils/package");
const execute = (logger, octokit, context) => __awaiter(void 0, void 0, void 0, function* () { return (0, package_1.commit)(yield (0, package_1.updatePackageVersion)(logger, context), logger, github_action_helper_1.Utils.getOctokit(), context); });
exports.execute = execute;

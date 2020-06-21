"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPLACE_RULES = exports.TARGET_EVENTS = void 0;
const misc_1 = require("./utils/misc");
exports.TARGET_EVENTS = {
    'create': [
        (context) => misc_1.isValidTagNameContext(context),
    ],
    'pull_request': [
        [
            'opened',
            (context) => misc_1.isValidContext(context),
        ],
        [
            'reopened',
            (context) => misc_1.isValidContext(context),
        ],
        [
            'synchronize',
            (context) => misc_1.isValidContext(context),
        ],
    ],
    'release': [
        [
            'published',
            (context) => misc_1.isValidContext(context),
        ],
        [
            'rerequested',
            (context) => misc_1.isValidContext(context),
        ],
    ],
    'push': [
        (context) => misc_1.isValidContext(context),
    ],
};
exports.REPLACE_RULES = [
    (version) => ({
        file: 'readme.txt',
        from: /^Stable tag\s*:\s*v?\d+(\.\d+)*$/m,
        to: `Stable tag: ${version}`,
    }),
    (version) => ({
        file: 'update.json',
        from: /"version"\s*:\s*"v?\d+(\.\d+)*"\s*(,?)$/m,
        to: `"version": "${version}"$2`,
    }),
    (version, autoload) => ({
        file: autoload,
        from: /Version\s*:\s*v?\d+(\.\d+)*$/m,
        to: `Version: ${version}`,
    }),
    (version) => ({
        file: 'assets/js/package.json',
        from: /"version"\s*:\s*"v?\d+(\.\d+)*"\s*(,?)$/m,
        to: `"version": "${version}"$2`,
    }),
];

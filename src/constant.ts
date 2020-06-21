import {Context} from '@actions/github/lib/context';
import {isValidContext, isValidTagNameContext} from './utils/misc';

export const TARGET_EVENTS = {
  'create': [
    (context: Context): boolean => isValidTagNameContext(context),
  ],
  'pull_request': [
    [
      'opened',
      (context: Context): boolean => isValidContext(context),
    ],
    [
      'reopened',
      (context: Context): boolean => isValidContext(context),
    ],
    [
      'synchronize',
      (context: Context): boolean => isValidContext(context),
    ],
  ],
  'release': [
    [
      'published',
      (context: Context): boolean => isValidContext(context),
    ],
    [
      'rerequested',
      (context: Context): boolean => isValidContext(context),
    ],
  ],
  'push': [
    (context: Context): boolean => isValidContext(context),
  ],
};

export const REPLACE_RULES: Array<(version: string, autoload: string) => { file: string; from: RegExp; to: string }> = [
  (version: string): { file: string; from: RegExp; to: string } => ({
    file: 'readme.txt',
    from: /^Stable tag\s*:\s*v?\d+(\.\d+)*$/m,
    to: `Stable tag: ${version}`,
  }),
  (version: string): { file: string; from: RegExp; to: string } => ({
    file: 'update.json',
    from: /"version"\s*:\s*"v?\d+(\.\d+)*"\s*(,?)$/m,
    to: `"version": "${version}"$2`,
  }),
  (version: string, autoload: string): { file: string; from: RegExp; to: string } => ({
    file: autoload,
    from: /Version\s*:\s*v?\d+(\.\d+)*$/m,
    to: `Version: ${version}`,
  }),
  (version: string): { file: string; from: RegExp; to: string } => ({
    file: 'assets/js/package.json',
    from: /"version"\s*:\s*"v?\d+(\.\d+)*"\s*(,?)$/m,
    to: `"version": "${version}"$2`,
  }),
];

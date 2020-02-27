/* eslint-disable no-magic-numbers */
import path from 'path';
import { isTargetEvent } from '@technote-space/filter-github-action';
import { generateContext, testEnv } from '@technote-space/github-action-test-helper';
import {
	isTestTag,
	getTestTag,
	isValidTagName,
	getPackageVersionToUpdate,
	getReplaceResultMessages,
	getCommitMessage,
	getTagName,
	findAutoloadFile,
} from '../../src/utils/misc';
import { TARGET_EVENTS } from '../../src/constant';

const rootDir        = path.resolve(__dirname, '../..');
const fixtureRootDir = path.resolve(__dirname, '../fixtures');

describe('isTargetEvent', () => {
	testEnv(rootDir);

	it('should return true 1', () => {
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'push',
			ref: 'refs/tags/v1.2.3',
		}))).toBe(true);
	});

	it('should return true 2', () => {
		process.env.INPUT_BRANCH_PREFIX = 'release/';
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'push',
			ref: 'refs/heads/release/v1.2.3',
		}))).toBe(true);
	});

	it('should return true 3', () => {
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'release',
			action: 'published',
		}, {
			payload: {
				release: {
					'tag_name': 'v1.2.3',
				},
			},
		}))).toBe(true);
	});

	it('should return true 4', () => {
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'release',
			action: 'rerequested',
		}, {
			payload: {
				release: {
					'tag_name': 'v1.2.3',
				},
			},
		}))).toBe(true);
	});

	it('should return true 5', () => {
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'create',
			ref: 'refs/tags/v1.2.3',
		}))).toBe(true);
	});

	it('should return true 6', () => {
		process.env.INPUT_BRANCH_PREFIX = 'release/';
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'pull_request',
			action: 'opened',
			ref: 'refs/pull/123/merge',
		}, {
			payload: {
				'pull_request': {
					head: {
						ref: 'release/v1.2.3',
					},
				},
			},
		}))).toBe(true);
	});

	it('should return false 1', () => {
		process.env.INPUT_BRANCH_PREFIX = 'release/';
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'pull_request',
			action: 'opened',
			ref: 'refs/tags/test',
		}, {
			payload: {
				'pull_request': {
					head: {
						ref: 'feature/new-feature',
					},
				},
			},
		}))).toBe(false);
	});

	it('should return false 2', () => {
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'push',
			ref: 'refs/tags/test',
		}))).toBe(false);
	});

	it('should return false 3', () => {
		process.env.INPUT_BRANCH_PREFIX = 'release';
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'push',
			ref: 'refs/heads/release/v1.2.3',
		}))).toBe(false);
	});

	it('should return false 4', () => {
		process.env.INPUT_BRANCH_PREFIX = 'release';
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'push',
			ref: 'refs/heads/release/v1.2.3',
		}))).toBe(false);
	});

	it('should return false 5', () => {
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'release',
			action: 'published',
		}, {
			payload: {
				release: {
					'tag_name': 'abc',
				},
			},
		}))).toBe(false);
	});

	it('should return false 6', () => {
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'release',
			action: 'created',
			ref: 'refs/tags/v1.2.3',
		}, {
			payload: {
				release: {
					'tag_name': 'v1.2.3',
				},
			},
		}))).toBe(false);
	});

	it('should return false 7', () => {
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'create',
			ref: 'refs/heads/v1.2.3',
		}))).toBe(false);
	});

	it('should return false 8', () => {
		process.env.INPUT_BRANCH_PREFIX = 'release/';
		expect(isTargetEvent(TARGET_EVENTS, generateContext({
			event: 'pull_request',
			action: 'closed',
			ref: 'refs/pull/123/merge',
		}, {
			payload: {
				'pull_request': {
					head: {
						ref: 'release/v1.2.3',
					},
				},
			},
		}))).toBe(false);
	});
});

describe('isTestTag', () => {
	testEnv(rootDir);

	it('should return true', () => {
		process.env.INPUT_TEST_TAG_PREFIX = 'test/';
		expect(isTestTag('test/v1.2.3')).toBe(true);
	});

	it('should return false', () => {
		process.env.INPUT_TEST_TAG_PREFIX = 'test/';
		expect(isTestTag('v1.2.3')).toBe(false);
	});
});

describe('getTestTag', () => {
	testEnv(rootDir);

	it('should get test tag', () => {
		process.env.INPUT_TEST_TAG_PREFIX = 'test/';
		expect(getTestTag('test/v1.2.3')).toBe('v1.2.3');
	});
});

describe('isValidTagName', () => {
	testEnv(rootDir);

	it('should return true 1', () => {
		expect(isValidTagName('1.2.3')).toBe(true);
		expect(isValidTagName('v1.2.3')).toBe(true);
	});

	it('should return true 2', () => {
		process.env.INPUT_TEST_TAG_PREFIX = 'test/';
		expect(isValidTagName('test/1.2.3')).toBe(true);
		expect(isValidTagName('test/v1.2.3')).toBe(true);
	});

	it('should return false 1', () => {
		expect(isValidTagName('test/1.2.3')).toBe(false);
		expect(isValidTagName('test/v1.2.3')).toBe(false);
		expect(isValidTagName('.2.3')).toBe(false);
		expect(isValidTagName('abc')).toBe(false);
		expect(isValidTagName('')).toBe(false);
	});

	it('should return false 2', () => {
		process.env.INPUT_TEST_TAG_PREFIX = 'test/';
		expect(isValidTagName('.2.3')).toBe(false);
		expect(isValidTagName('abc')).toBe(false);
		expect(isValidTagName('')).toBe(false);
	});
});

describe('getPackageVersionToUpdate', () => {
	testEnv(rootDir);

	it('should get version', () => {
		expect(getPackageVersionToUpdate('1.2.3')).toBe('1.2.3');
		expect(getPackageVersionToUpdate('v1.2.3')).toBe('1.2.3');
	});

	it('should get version', () => {
		process.env.INPUT_TEST_TAG_PREFIX = 'test/';

		expect(getPackageVersionToUpdate('test/1.2.3')).toBe('1.2.3');
		expect(getPackageVersionToUpdate('test/v1.2.3')).toBe('1.2.3');
	});
});

describe('getReplaceResultMessages', () => {
	it('should return empty', () => {
		expect(getReplaceResultMessages([])).toEqual([]);
	});

	it('should get messages', () => {
		const messages = getReplaceResultMessages([
			{
				file: 'test1',
				hasChanged: true,
			},
			{
				file: 'test2',
				hasChanged: false,
			},
		]);

		expect(messages).toHaveLength(2);
		expect(messages[0]).toContain('test1');
		expect(messages[1]).toContain('test2');
	});
});

describe('getCommitMessage', () => {
	testEnv(rootDir);

	it('should get commit message', () => {
		process.env.INPUT_COMMIT_MESSAGE = 'test message';

		expect(getCommitMessage()).toBe('test message');
	});

	it('should get default commit message', () => {
		expect(getCommitMessage()).toBe('chore: update wp version');
	});
});

describe('getTagName', () => {
	testEnv(rootDir);

	it('should get tag name', () => {
		expect(getTagName(generateContext({
			event: 'push',
			ref: 'refs/tags/test',
		}))).toBe('test');
	});

	it('should get tag name from branch', () => {
		process.env.INPUT_BRANCH_PREFIX = 'release/';
		expect(getTagName(generateContext({
			event: 'push',
			ref: 'refs/heads/release/v1.2.3',
		}))).toBe('v1.2.3');
	});
});

describe('findAutoloadFile', () => {
	it('should return autoload file 1', () => {
		expect(findAutoloadFile(path.join(fixtureRootDir, 'plugin1'))).toBe('autoload.php');
	});

	it('should return autoload file 2', () => {
		expect(findAutoloadFile(path.join(fixtureRootDir, 'plugin2'))).toBe('plugin2.php');
	});

	it('should throw error', () => {
		expect(() => findAutoloadFile(path.join(fixtureRootDir, 'plugin3'))).toThrow();
	});
});

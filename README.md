# WP Version Check Action

[![CI Status](https://github.com/technote-space/wp-version-check-action/workflows/CI/badge.svg)](https://github.com/technote-space/wp-version-check-action/actions)
[![codecov](https://codecov.io/gh/technote-space/wp-version-check-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/wp-version-check-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/wp-version-check-action/badge)](https://www.codefactor.io/repository/github/technote-space/wp-version-check-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/wp-version-check-action/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

This is a `GitHub Actions` to check versions of wp plugin files before publish.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Usage](#usage)
  - [Used when push](#used-when-push)
  - [Used in the release process](#used-in-the-release-process)
- [Options](#options)
  - [BRANCH_PREFIX](#branch_prefix)
  - [COMMIT_DISABLED](#commit_disabled)
  - [COMMIT_MESSAGE](#commit_message)
  - [TEST_TAG_PREFIX](#test_tag_prefix)
  - [NEXT_VERSION](#next_version)
- [Action event details](#action-event-details)
  - [Target events](#target-events)
  - [Conditions](#conditions)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
### Used when push
   e.g. `.github/workflows/check_version.yml`
   ```yaml
   on: push
   name: Check version
   jobs:
     checkVersion:
       name: Check version
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2

         # Use this GitHub Action
         - name: Check version
           uses: technote-space/wp-version-check-action@v1
           with:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
             BRANCH_PREFIX: release/
   ```

### Used in the release process
   e.g. `.github/workflows/release.yml`
   ```yaml
   on:
    push:
      tags:
        - 'v*'
   name: Publish Package
   jobs:
     release:
       name: Publish Package
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v2

         # Use this GitHub Action
         - name: Check version
           uses: technote-space/wp-version-check-action@v1
           with:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
             COMMIT_DISABLED: 1

         - name: Install Package dependencies
           run: yarn install
         - name: Build
           run: yarn build
         - name: Publish
           uses: actions/npm@master
           env:
             NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
           with:
             args: publish
   ```
[More details of target event](#action-event-details)

## Options
### BRANCH_PREFIX
Branch name prefix.  
default: `''`  
e.g. `release/`

### COMMIT_DISABLED
Whether commit is disabled.  
default: `''`

### COMMIT_MESSAGE
Commit message of update version commit.  
default: `'chore: update wp version'`

### TEST_TAG_PREFIX
Prefix for test tag.  
default: `''`  
e.g. `'test/'`

### NEXT_VERSION
Specify next version.  
default: `''`  
e.g. `'v1.2.3'`

## Action event details
### Target events
| eventName: action | condition |
|:---:|:---:|
|push: *|[condition1](#condition1)|
|release: published|[condition1](#condition1)|
|release: rerequested|[condition1](#condition1)|
|pull_request: opened|[condition2](#condition2)|
|created: *|[condition3](#condition3)|
### Conditions
#### condition1
- tags
  - semantic versioning tag (e.g. `v1.2.3`)
- branches
  - `${BRANCH_PREFIX}${tag}`
    - tag: semantic versioning tag (e.g. `v1.2.3`)
    - e.g. branch: `release/v1.2.3`
#### condition2
- branches
  - `${BRANCH_PREFIX}${tag}`
    - tag: semantic versioning tag (e.g. `v1.2.3`)
    - e.g. branch: `release/v1.2.3`
#### condition3
- tags
  - semantic versioning tag (e.g. `v1.2.3`)

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)

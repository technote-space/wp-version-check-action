# WP Version Check Action

[![CI Status](https://github.com/technote-space/wp-version-check-action/workflows/CI/badge.svg)](https://github.com/technote-space/wp-version-check-action/actions)
[![codecov](https://codecov.io/gh/technote-space/wp-version-check-action/branch/main/graph/badge.svg)](https://codecov.io/gh/technote-space/wp-version-check-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/wp-version-check-action/badge)](https://www.codefactor.io/repository/github/technote-space/wp-version-check-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/wp-version-check-action/blob/main/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

公開前にプラグインのバージョンをチェックする`GitHub Actions`です。

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
  - [プッシュ時に使用](#%E3%83%97%E3%83%83%E3%82%B7%E3%83%A5%E6%99%82%E3%81%AB%E4%BD%BF%E7%94%A8)
  - [リリースプロセスで使用](#%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9%E3%81%A7%E4%BD%BF%E7%94%A8)
- [対象ファイル](#%E5%AF%BE%E8%B1%A1%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB)
- [オプション](#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)
- [Action イベント詳細](#action-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E8%A9%B3%E7%B4%B0)
  - [対象イベント](#%E5%AF%BE%E8%B1%A1%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88)
  - [Conditions](#conditions)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 使用方法
### プッシュ時に使用
   例：`.github/workflows/check_version.yml`
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
             BRANCH_PREFIX: release/
   ```

### リリースプロセスで使用
   例：`.github/workflows/release.yml`
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
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '12.x'
             registry-url: 'https://registry.npmjs.org'

         # Use this GitHub Action
         - name: Check version
           uses: technote-space/wp-version-check-action@v1
           with:
             COMMIT_DISABLED: 1

         - run: npm install
         - run: npm run build
         - run: npm publish
           env:
             NODE_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
   ```
[対象イベントの詳細](#action-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E8%A9%B3%E7%B4%B0)

## 対象ファイル
- readme.txt
  - `Stable tag:`
- update.json
  - `"version"`
- autoload file (`Version` 情報を含むPHPファイル)
  - `Version:`

## オプション
| name | description | default | required | e.g. |
|:---:|:---|:---:|:---:|:---:|
|BRANCH_PREFIX|ブランチプリフィックス| | |`release/`|
|COMMIT_DISABLED|コミットが無効かどうか| | |`true`|
|COMMIT_MESSAGE|パッケージバージョン更新用コミットのメッセージ|`feat: update version`|true| |
|TEST_TAG_PREFIX|テスト用タグのプリフィックス| | |`test/`|
|NEXT_VERSION|次のバージョンを指定| | |`v1.2.3`|
|GITHUB_TOKEN|Access token|`${{github.token}}`|true|`${{secrets.ACCESS_TOKEN}}`|

## Action イベント詳細
### 対象イベント
| eventName: action | condition |
|:---:|:---:|
|push: *|[condition1](#condition1)|
|release: published|[condition1](#condition1)|
|release: rerequested|[condition1](#condition1)|
|pull_request: opened, reopened, synchronize|[condition2](#condition2)|
|created: *|[condition3](#condition3)|

### Conditions
#### condition1
- tags
  - semantic versioning tag (例：`v1.2.3`)
- branches
  - `${BRANCH_PREFIX}${tag}`
    - tag: semantic versioning tag (例：`v1.2.3`)
    - 例：branch: `release/v1.2.3`
#### condition2
- branches
  - `${BRANCH_PREFIX}${tag}`
    - tag: semantic versioning tag (例：`v1.2.3`)
    - 例：branch: `release/v1.2.3`
#### condition3
- tags
  - semantic versioning tag (例：`v1.2.3`)

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)

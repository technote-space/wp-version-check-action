# WP Version Check Action

[![CI Status](https://github.com/technote-space/wp-version-check-action/workflows/CI/badge.svg)](https://github.com/technote-space/wp-version-check-action/actions)
[![codecov](https://codecov.io/gh/technote-space/wp-version-check-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/wp-version-check-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/wp-version-check-action/badge)](https://www.codefactor.io/repository/github/technote-space/wp-version-check-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/wp-version-check-action/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

公開前にプラグインのバージョンをチェックする`GitHub Actions`です。

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Setup](#setup)
  - [yarn](#yarn)
  - [npm](#npm)
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
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
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
[対象イベントの詳細](#action-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E8%A9%B3%E7%B4%B0)

## オプション
### BRANCH_PREFIX
ブランチプリフィックス  
default: `''`  
例：`release/`

### COMMIT_DISABLED
コミットが無効かどうか  
default: `''`

### COMMIT_MESSAGE
パッケージバージョン更新用コミットのメッセージ  
default: `'feat: update version'`

### TEST_TAG_PREFIX
テスト用タグのプリフィックス  
default: `''`  
例：`'test/'`

## Action イベント詳細
### 対象イベント
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

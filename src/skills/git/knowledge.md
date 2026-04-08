# Git 核心知识点

Git 是分布式版本控制系统，用于追踪文件变更、管理提交历史、多人协作开发。前端开发中，Git 不只是“提交代码”的工具，更是分支协作、代码审查、发布回滚、问题定位的基础设施。

---

## 1. Git 的核心概念

Git 中最重要的几个概念：

- 工作区 Working Directory
- 暂存区 Staging Area / Index
- 本地仓库 Local Repository
- 远程仓库 Remote Repository

工作流程通常是：

1. 修改工作区文件
2. 使用 `git add` 放入暂存区
3. 使用 `git commit` 生成本地提交
4. 使用 `git push` 推送到远程

---

## 2. Git 与 SVN 的差异

Git 是分布式版本控制：

- 本地就有完整仓库历史
- 分支创建和切换成本低
- 更适合离线工作和并行开发

---

## 3. 初始化与克隆

```bash
git init
git clone https://example.com/repo.git
```

- `git init`：初始化本地仓库
- `git clone`：从远程拉取完整仓库

---

## 4. 文件状态

Git 中常见文件状态：

- `untracked`
- `modified`
- `staged`
- `committed`

查看状态：

```bash
git status
```

---

## 5. 暂存区的重要性

暂存区允许你把一次工作中的不同改动拆成多次提交，控制提交粒度。

```bash
git add src/app.ts
git commit -m "fix: correct login redirect"
```

---

## 6. 提交与提交规范

好的提交应该：

- 单一目的
- 改动自洽
- 提交信息清楚

常见前缀：

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`

---

## 7. 查看历史与差异

```bash
git log
git log --oneline --graph --decorate
git diff
git diff --staged
```

---

## 8. 撤销操作

```bash
git restore file.txt
git restore --staged file.txt
git commit --amend
```

注意：

- 已共享历史不要随意改写

---

## 9. 分支管理

```bash
git branch
git switch -c feature/login
```

分支适合：

- 功能开发
- Bug 修复
- 实验性改动

### HEAD

`HEAD` 表示当前所在提交位置，通常指向当前分支最新提交。

---

## 10. 合并 Merge

```bash
git switch main
git merge feature/login
```

Merge 会保留真实分支结构，不重写历史。

---

## 11. 变基 Rebase

```bash
git switch feature/login
git rebase main
```

Rebase 会让历史更线性，但会重写历史。

实践原则：

- 私有分支可用 rebase 整理历史
- 共享分支慎用 rebase 后强推

---

## 12. Merge 与 Rebase 的区别

Merge：

- 保留分叉历史
- 不改写历史

Rebase：

- 改写提交基础
- 历史更线性

---

## 13. 冲突处理

冲突通常出现在：

- merge
- rebase
- cherry-pick

流程：

1. 手动修改冲突文件
2. `git add`
3. 继续 merge/rebase

---

## 14. 远程仓库

```bash
git remote -v
git fetch
git pull
git push
```

区别：

- `fetch`：只拉取
- `pull`：拉取并合并

---

## 15. 远程跟踪分支

例如：

- `origin/main`
- `origin/dev`

它们表示远程分支在本地的同步映射。

---

## 16. Stash

```bash
git stash
git stash list
git stash pop
```

适合临时保存未完成改动。

---

## 17. Cherry-pick

```bash
git cherry-pick abc1234
```

适合从其他分支摘取某个提交。

---

## 18. Reset、Revert、Restore

- `restore`：恢复文件
- `reset`：移动分支指针，可影响暂存区/工作区
- `revert`：创建反向提交撤销历史

共享分支上撤销通常更推荐 `revert`。

---

## 19. Tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

Tag 常用于版本发布标记。

---

## 20. `.gitignore`

用于忽略不应纳入版本控制的文件，如：

- `node_modules/`
- `dist/`
- 日志文件
- 本地环境文件

---

## 21. Reflog

```bash
git reflog
```

在误 reset、误删提交时非常有用，很多历史都能从 reflog 找回。

---

## 22. 常见协作流程

常见 feature branch 流程：

1. 从主分支拉功能分支
2. 本地开发提交
3. 同步主分支最新改动
4. 提交 PR / MR
5. review 后合并

---

## 23. Git 最佳实践

- 一个提交只做一件事
- 提交前先看 diff
- 小步提交
- 不随意改写共享历史
- 冲突解决后认真验证

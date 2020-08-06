**Create your branch locally, new branch followed by checkout:**
```
git checkout -b <branch-name>
```

**Push to remote:**
```
git push -u origin <branch-name>
```

**Delete a branch on your local filesystem:**
```
git branch -d <branch-name>
```

**Delete the branch on remote:**
```
git push origin :<branch-name>
```

**Show which branches contain all commits from current branch:**
```
git branch --merged
```

**Rename branch:**
```
git branch -m old new
```
---
title: Git - Config
category: VCS
---

**To set new values:**
```
git config user.name "User Name"
git config user.email x@x.x
```

**To check current values:**
```
git config --list
```
---
title: Git - Diff
category: VCS
---

**To diff your changes:**
```
git diff index.html
```

**To diff your changes on stage:**
```
git diff --staged index.html
```

**To show changes on same line with different colors:**
```
git diff --color-words index.html
```

**To show changes between branches on same line with different colors:**
```
git diff --color-words test..test2
```

**To show changes between commit abc123 and now on file specified:**
```
git diff abc123 index.html
```

>For word wrap on less in diff use minus sign (-) + shift + s + enter
---
title: Git - Erase
category: VCS
---

**Initialize repo:**
```
git init
```

**Add remote:**
```
git remote add origin https://x@bitbucket.org/x/x.git
```

**Add files:**
```
git add .
```

**Commit changes:**
```
git commit -m "Initial commit"
```

**Push code, force as it won't be in sync:**
```
git push --force -u origin master
```

**Remove leftover branches:**
```
git push origin :oldBranch
```
---
title: Git - Gitignore
category: VCS
---

**Stop tracking a file if gitignore was added after the file was already tracked:**
```
git rm --cached index.html
```

***
**Sources:**
* https://github.com/github/gitignore
---
title: Git - Line Ending
category: VCS
---

**Default setting for Windows OS is globally configured like so:**
```
git config --global core.autocrlf true
```

**And configured like the following on Linux and Mac OS:**
```
git config --global core.autocrlf input
```

***
**Sources:**
* https://simontech.me/support/knowledge-base/59-git/167-line-endings-and-difference-in-os
---
title: Git - Log
category: VCS
---

**Show git commit log with one line per commit:**
```
git log --oneline
```

**Show git commit log with one line per commit, only commits on the range specified:**
```
git log abc123..abc1234 --oneline
```

**Show commits with changes on index.html since commit abc123:**
```
git log abc123.. Index.html
```

**Show lines changes on index.html since commit abc123:**
```
git log -p abc123.. Index.html
```

**Show statistics or number of changes per commit and summary:**
```
git log --stat --summary
```

**Search for term temp on commit comments:**
```
git log --grep="temp"
```

**History of a file with diffs including renames:**
```
git log --follow -p -- <file>
```
---
title: Git - Ls-tree
category: VCS
---

**To list files structure of a commit at HEAD:**
```
git ls-tree HEAD
```
---
title: Git - Remote
category: VCS
---

**Add first time if doesn't exist:**
```
git remote add origin https://x@bitbucket.org/x/x.git  
```

**Change URL:**
```
git remote set-url origin https://x@bitbucket.org/x/x.git
```
---
title: Git - Reset
category: VCS
---

```
git fetch --all && git reset --hard origin/master && git pull
```
---
title: Git - Simulate Clean
category: VCS
---

**Simulate a cleanup operation of untracked files. Won't remove anything:**
```
git clean -n
```

**Will remove any untracked files:**
```
git clean -f
```
---

title: Git - SVN2GIT
category: VCS
---

**Steps to convert SVN repository to GIT using svn2git:**

svn co --username x http://x.x.x.x/x
svn log --quiet | grep -E "r[0-9]+ \| .+ \|" | cut -d'|' -f2 | sed 's/ //g' | sort | uniq
echo "\
x x x <x@x.x>
x x x <x@x.x>
x x x <x@x.x>
...
x x x <x@x.x>" > authors.txt
svn2git http://x.x.x.x/x --authors ./authors.txt --verbose
git remote add origin https://x@bitbucket.org/x/x.git
git pull origin master
git config --global user.name "User Name"
git config --global user.email x@x.x
git add file.txt
git commit -m "SVN to Git Migration"
git push -u origin master


***
**Sources:**
* https://riptutorial.com/git/example/22730/migrate-from-svn-to-git-using-svn2git
---
title: Git - Undo
category: VCS
---

**Checkout a file, discard any uncommitted change and stay on the same branch:**
```
git checkout -- index.html
```

**Checkout a file from an older commit:**
```
git checkout abcdef123456 -- index.html
```

**Unstage a file:**
```
git reset HEAD index.html
```

**Amend last commit, reusing it without creating a new commit:**
```
git commit --amend -m "test"
```

**Reset HEAD to specified commit:**
```
git reset --hard abcdef123456
```

**Reset HEAD to specified commit, the changes are on staging area and need to be committed:**
```
git reset --mixed abcdef123456
```

**Reset HEAD to specified commit, the changes are on the FS to be staged and committed:**
```
git reset --soft abcdef123456
```

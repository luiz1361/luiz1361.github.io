---
title: OHMYZSH
permalink: /docs/linux/ohmyzsh/
---
---
title: Ohmyzsh - Ubuntu
category: Linux
---

**Update the packages:**
```
sudo apt-get update && sudo apt upgrade
```

**Install prerequisite packages (ZSH, powerline & powerline fonts):**
```
sudo apt install zsh powerline fonts-powerline
```

**Clone the Oh My Zsh Repo:**
```
git clone https://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
```

**Create a New ZSH configuration file:**
```
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
```

**Set up a fancy theme for your terminal edit ~/.zshrc**
```
vim ~/.zshrc
```
>Find the line ZSH_THEME="robbyrussell" replace robbyrussell with agnoster theme in .zshrc

**Change the default Shell:**
```
chsh -s /bin/zsh
```

**Updating:**
```
cd .oh-my-zsh
upgrade_oh_my_zsh
```

**Want Syntax Highlighting? install ZSH Syntax Highlighting for Oh My Zsh:**
```
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git "$HOME/.zsh-syntax-highlighting" --depth 1
echo "source $HOME/.zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> "$HOME/.zshrc"
```

**Revert back to Bash Shell**
chsh -s /bin/bash

***
**Sources:**
* https://github.com/robbyrussell/oh-my-zsh#manual-updates

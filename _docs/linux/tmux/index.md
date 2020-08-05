**Start:**
```
tmux
screen
```

**List sessions:**
```
tmux ls
screen -ls
```

**Detach:**
```
tmux detach
Ctrl+a d
```

**Attach:**
```
tmux attach -t 0
screen -r 10835
```

**Split vertically:**
```
screen Ctrl+a S + Crtl+tab + Crtl+c
tmux Ctrl+b "
```

**Split horizontally:**
```
screen Ctrl+a | + Crtl+tab + Crtl+c
tmux Ctrl+b %
```

**Switch panes between vertical vs horizontal and re-balance:**
```
tmux Ctrl+b and Alt+1 or Alt+2
```

**Send command all panes:**
```
tmux Ctrl-B : setw synchronize-panes on
```

**Next pane:**
```
tmux Ctrl+O
```

**Select pane:**
```
tmux Ctrl+q and type number
```

**Zoom pane to full screen and go back to pane:**
```
tmux Ctrl+z
```

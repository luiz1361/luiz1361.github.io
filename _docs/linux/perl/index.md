---
title: PERL
permalink: /docs/linux/perl/
---
---
title: Perl - Substitute Line Break
category: Linux
---

**Using Perl for substitution of ),( by break line:**
```
cat tst | perl -pe 's/\)\,\(/\n/g'
```

---
title: WMIC
permalink: /docs/windows/wmic/
---
---
title: WMIC - Random
category: Windows
---

**Retrieve memory information:**
```
wmic MemoryChip get BankLabel, Capacity, MemoryType, TypeDetail, Speed
```

**Retrieve service tag information:**
```
wmic csproduct get vendor,name,identifyingnumber
```

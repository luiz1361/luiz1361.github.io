---
title: ATG
permalink: /docs/application/atg/
---
---
title: ATG
permalink: /docs/application/atg/
---

# Route http log

Add route below to output logs at https://x.x.x/atg/test:
```bash
router.get('/test', util.isLoggedIn, (req, res) => {
    Atg.find({}, function (err, docs) {
        res.type('application/json').status(200).send(docs);
    });
});
```

# do things

asdf

---

## require local function

```js
const matchE = require('./sub-dir/match-e.js');
```
---

## user input

```js
const userString = process.argv[2] || '';
```

---

## Check for E

```js
const includesE = matchE(userString);
```

---

## log result

```js
console.log(`${userString} ${includesE ? 'does' : 'does not'} include "e"`);
```

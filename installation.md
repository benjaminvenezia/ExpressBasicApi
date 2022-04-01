# Set up d'un projet from scratch.

0. installer node

---

1. créer un fichier app.js

---

2. `npm init`

---

3. `npm i express --save`

---

4. création de la base dans app.js:

```
const express = require("express");
const app = express(); const port = 3000;
app.get("/", (req, res) => res.send("Hello, Express 👋"));
app.listen(port, console.log(`Notre application Node est démarée sur : http://localhost:${port}`))
```

---

5. `npm run start`
   (rappel : On a remplacé le script de base par :

```
"scripts": {
   "start": "node app.js"
},)
```

---

6. sur le port localhost:3000 tourne notre application!

---

7. `npm install nodemon --save-dev` : Permet d'obtenir le rafraichissement du serveur en mode daemon.

| command      | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| `--save-dev` | permet de placer le package dans la partie devDependencies du package.json |

---

8. dans package.json remplacer `start": "node app.js"` par `start": "nodemon app.js"`

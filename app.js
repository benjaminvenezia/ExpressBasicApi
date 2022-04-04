//On récupère la dépendance express dans node_modules
const express = require("express");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const sequelize = require("./src/db/sequelize");
const res = require("express/lib/response");

const app = express();
const port = process.env.PORT || 3000;

//Middleware
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(bodyParser.json());

sequelize.initDb();

app.get('/', (req,res) => {
  res.json('Helllloooo heroku! ')
})

//endpoints
//revient à écrire:
//const findAllPokemons = require('./src/routes/findAllPokemons')
//findAllPokemons(app) : app étant notre objet express
require("./src/routes/findAllPokemons")(app);
require("./src/routes/findPokemonByPk")(app);
require("./src/routes/createPokemon")(app);
require("./src/routes/updatePokemon")(app);
require("./src/routes/deletePokemon")(app);
require("./src/routes/login")(app);

//On ajoute la gestion des erreurs 404
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(
  port,
  console.log(
    `Notre application Node est démarée sur :  http://localhost:${port}`
  )
);

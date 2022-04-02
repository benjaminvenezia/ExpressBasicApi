//On récupère la dépendance express dans node_modules
const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const sequelize = require("./src/db/sequelize");

const app = express();
const port = 3000;

//Middleware
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

sequelize.initDb();

//endpoints 
//revient à écrire:
//const findAllPokemons = require('./src/routes/findAllPokemons')
//findAllPokemons(app) : app étant notre objet express
require("./src/routes/findAllPokemons")(app); 
require("./src/routes/findPokemonByPk")(app); 
require("./src/routes/createPokemon")(app); 

app.listen(
  port,
  console.log(
    `Notre application Node est démarée sur :  http://localhost:${port}`
  )
);

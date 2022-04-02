//On récupère la dépendance express dans node_modules
const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const { success, getUniqueId } = require("./helper.js");

let pokemons = require("./src/db/mock-pokemon");
const PokemonModel = require("./src/models/pokemon");
const { rsort } = require("semver");

//On crée une instance d'express, il s'agit d'un petit serveur web sur lequel tournera l'api rest.
const app = express();
//Port sur lequel tournera l'api rest
const port = 3000;


//Middleware
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

//On démarre l'api rest sur le port 3000 et on affiche un message de log dans le terminal de commande.
app.listen(
  port,
  console.log(
    `Notre application Node est démarée sur :  http://localhost:${port}`
  )
);

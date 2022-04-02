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

//initialisation de l'orm
const sequelize = new Sequelize("pokedex", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    timezone: "Etc/GMT-2",
  },
  logging: false,
});

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connexion à la base de données a bien été établie.")
  )
  .catch((error) =>
    console.error(`Impossible de se connecter à la base de données : ${error}`)
  );

//modèle
const Pokemon = PokemonModel(sequelize, DataTypes);

sequelize.sync({ force: true }).then((_) => {
  console.log('La base de données "Pokedex a bien été synchronisée');

  pokemons.map((pokemon) => {
    Pokemon.create({
      name: pokemon.name,
      hp: pokemon.hp,
      cp: pokemon.cp,
      picture: pokemon.picture,
      types: pokemon.types.join(),
    }).then((bulbizarre) => console.log(bulbizarre.toJSON()));
  });
});

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

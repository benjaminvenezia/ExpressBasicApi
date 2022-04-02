//On récupère la dépendance express dans node_modules
const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");
const { success, getUniqueId } = require("./helper.js");

let pokemons = require("./mock-pokemon");
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

//Middleware
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

//endpoint
/**
 * @param req : Object request correspondant à la requête reçue en entrée par notre endpoint
 * @param res : Objet response qu'on doit renvoyer depuis Express à notre client.
 * @see send : methode de l'objet response afin de retourner le message au client.
 */
app.get("/", (req, res) => res.send("Hello, Express 100 👋"));

app.get("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const pokemon = pokemons.find((pokemon) => pokemon.id === id);
  const message = "Un pokémon a bien été trouvé. ";
  res.json(success(message, pokemon));
});

app.get("/api/pokemons", (req, res) => {
  const message = "L'ensemble des pokémons ont été retournés. ";
  res.json(success(message, pokemons));
});

app.post("/api/pokemons", (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `Le pokemon ${pokemonCreated.name} a bien été crée.`;
  res.json(success(message, pokemonCreated));
});

app.put("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, id: id };
  // Pour chaque pokémon de la liste on retourne exactement le même pokémon sauf s'il s'agit du pokémon à modifier.
  pokemons = pokemons.map((pokemon) => {
    return pokemon.id === id ? pokemonUpdated : pokemon;
  });

  const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié.`;
  res.json(success(message, pokemonUpdated));
});

app.delete("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonDeleted = pokemons.find((pokemon) => pokemon.id === id);
  pokemons = pokemons.filter((pokemon) => pokemon.id !== id);
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`;
  res.json(success(message, pokemonDeleted));
});

//On démarre l'api rest sur le port 3000 et on affiche un message de log dans le terminal de commande.
app.listen(
  port,
  console.log(
    `Notre application Node est démarée sur :  http://localhost:${port}`
  )
);

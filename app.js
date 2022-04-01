//On récupère la dépendance express dans node_modules
const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const { success } = require("./helper.js");

let pokemons = require("./mock-pokemon");

//On crée une instance d'express, il s'agit d'un petit serveur web sur lequel tournera l'api rest.
const app = express();
//Port sur lequel tournera l'api rest
const port = 3000;

//Middleware
app.use(favicon(__dirname + "/favicon.ico")).use(morgan("dev"));

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

//On démarre l'api rest sur le port 3000 et on affiche un message de log dans le terminal de commande.
app.listen(
  port,
  console.log(
    `Notre application Node est démarée sur :  http://localhost:${port}`
  )
);

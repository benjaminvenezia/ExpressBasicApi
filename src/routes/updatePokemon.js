const { Pokemon } = require("../db/sequelize");

module.exports = (app) => {
  app.put("/api/pokemons/:id", (req, res) => {
    const id = req.params.id;
    Pokemon.update(req.body, {
      where: { id: id },
    })
      .then((_) => {
        return Pokemon.findByPk(id) //findByPk retourne une promesse. En ajoutant return, on catch l'erreur plus haut. (Plutôt que de dupliquer le message d'erreur)
          .then((pokemon) => {
            if (pokemon === null) {
              const message =
                "Le pokémon demandé n'existe pas, Réessayez avec un autre identifiant.";
              return res.statut(404).json(message);
            }
            const message = `Le pokémon ${pokemon.name} a bien été modifié.`;
            res.json({ message, data: pokemon });
          });
      })
      .catch((error) => {
        const message =
          "Le pokémon n'a pas pu être modifié. Réessayez dans quelques instants";
        res.status(500).json({ message, data: error });
      });
  });
};

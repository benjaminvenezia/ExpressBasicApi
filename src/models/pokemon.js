const validTypes = [
  "Plante",
  "Poison",
  "Feu",
  "Eau",
  "Insecte",
  "Vol",
  "Normal",
  "Electrik",
  "Fée",
];

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Pokemon",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le champ name ne peut être nul!",
          },
          notNull: { msg: "Le name est une propriété requise." },
          min: {
            args: [1],
            msg: "Le minimum de name est 0",
          },
          max: {
            args: [25],
            msg: "Le maximum de name est 25",
          },
        },
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres entiers pour les points de vie.",
          },
          notNull: { msg: "Les points de vie sont une propriété requise." },
          min: {
            args: [0],
            msg: "Le minimum de HP est 0",
          },
          max: {
            args: [999],
            msg: "Le maximum de HP est 999",
          },
        },
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres entiers pour le cp",
          },
          notNull: { msg: "Le cp est une propriété requise." },
          min: {
            args: [0],
            msg: "Le minimum de CP est 0",
          },
          max: {
            args: [99],
            msg: "Le maximum de CP est 99",
          },
        },
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {
            msg: "Merci de renseigner une adresse url valide.",
          },
          notNull: { msg: "L'url est une propriété requise." },
        },
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue("types").split(",");
        },
        set(types) {
          this.setDataValue("types", types.join());
        },
        validate: {
          isTypesValid(value) {
            //isTypesValid: nom arbitraire donné à notre validateur personnalisé
            if (!value) {
              throw new Error("Un pokémon doit au moins avoir un type");
            }
            if (value.split(",").length > 3) {
              throw new Error(
                "Un pokémon ne peux pas avoir plus de trois types"
              );
            }
            value.split(",").forEach((type) => {
              if (!validTypes.includes(type)) {
                throw new Error(
                  `Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`
                );
              }
            });
          },
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );
};

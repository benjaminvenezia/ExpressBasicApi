# Quelques notions de base

| command         | Description                       |
| --------------- | --------------------------------- |
| `req.params.id` | retourne le paramètre id de l'url |

```
app.get("/api/pokemons/:id", (req, res) => {
  const id = req.params.id;
  res.send(`Vous avez demandé le pokémon n°${id}`);
});

```

---

## Ce que doit contenir une réponse HTTP

| Réponse HTTP      | Description                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------ |
| Les données       | Ce qui doit être retourné au client                                                        |
| Le format Json    | Le format doit idéalement être du json                                                     |
| Le type MIME      | Le type MIME est une entête indiquant le format retourné. (Content-Type: application/json) |
| Le code de statut | code à 3 chiffre présent uniquement dans la réponse et pas dans la requête. (200)          |

## res.json()

| Réponse HTTP | Description                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| `res.json()  | Cette fonction d'express permet de prendre en compte deux contrainte (le format json et le type MIME) |

## exposer plus d'informations

- helper.js

```
exports.success = (message, data) => {
  return {
    message, //message:message
    data,
  };
};
```

- Cela permet d'ajouter des informations à notre Json. En plus de l'élément rendu, on pourra compléter le json avec un message supplémentaire.

```
const helper = require("./helper.js");

...

app.get("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const pokemon = pokemons.find((pokemon) => pokemon.id === id);
  const message = "Un pokémon a bien été trouvé. ";
  res.json(helper.success(message, pokemon));
});
```

- Désormais, nous retournons le pokemon désiré en plus du message.

### syntaxe améliorée

```
const { success } = require("./helper.js");

 (...)
  res.json(success(message, pokemon));
});
```

---

## middleware

- Les middlewares sont des fonctions javascript capables d'interagir avec les requêtes entrantes et sortantes de notre requête.
- Le middleware A permet d'appliquer un traitement aux requêtes HTTP entrantes et sortantes.
- Les middlewares fonctionnent par dessus les endpoints existants.
- Ce qui rend les middlewares un peu spéciaux est qu'ils peuvent accéder aux objets request (req) et response (res) d'express.
- Une fois le traitement terminé on le précise avec `next`

```
                .       ^
                .       .
requête HTTP    .       .  Réponse HTTP
                .       .
                v       .
                -----------
                MIDDLEWARE A
                -----------
                .       ^
                .       .
            req .       . res
                v       .
                ----------
                 API REST
```

---

### la forme d'un middleware

```
    const middleware = (req, res, next) => {
        //Traitement quelconque
        //on peut intervenir sur les objets 'req' et 'res'
        //Puis on indique à express que le traitement est terminé.
        next()
    }
```

### 5 catégories différentes de middleware

1. **Middleware d'application**

   > Ce sont les middlewares les plus courants lorsque l'on débute avec express. Ils sont directement reliés à l'instance d'express avec la méthode use.
   > Le middleware sera exécuté à chaque fois que l'API rest recevra une demande. Dans ce cas, on affichera un petit message dans le terminal de commande avec la date complète à laquelle notre api REST a reçu la requête entrante.
   > On peut utiliser ce type de middleware pour loger tout type d'événement ou pour tout autre traitement commun aux requêtes entrantes ou sortantes de notre API REST
   >
   > > ```
   > > var app = express();
   > > app.use(function(req, res, next)){
   > >    console.log('Time:', Date.now());
   > >    next();
   > >  }
   > >
   > > ```

2. **Middleware du Routeur**

   > Ce middleware fonctionne directement au router d'express. Il est très semblable au middleware d'application mais il n'est pas relié à l'instance d'express.
   > À la place, on le branche sur une instance de express.Router().
   > Concrétement cela permet de créer des sous ensembles de routes et de définir une hiérarchie et une organisation entre les routes de l'api RESt dans le cas ou celle-ci devient très importante en taille.
   > Mais pour les besoins simples, il n y a pas besoin d'utiliser ce type de middleware qui est plus avancé.

3. **Middleware de traitements d'erreurs**

   > Le middleware de traitement d'erreur est légérement différent car il doit prendre 4 arguments en compte. Il faut absolument fournir 4 arguments à ce middleware car c'est lui qui permet d'être identifié comme un middleware de traitement d'erreurs et pas autre chose. C'est pour cela que même si on n'utilise pas le paramètre next dans cet exemple on passe quand même 4 paramètres au middleware afin de respecter la règle des 4 arguments.
   >
   > > ```
   > > app.use(function(err, req, res, next)){
   > >    console.log(err);
   > >    res.send('Erreur !')
   > >  });
   > > ```

4. **Le Middleware intégré**

   > Historiquement il existait quelques middlewares directement intégrés à express un peu comme les modules déjà présent dans node.js. Mais depuis la version 4 d'express, il n'y a plus qu'un seul et unique middleware intégré a express et il se nomme `express.static`. Ce middleware a comme responsabilité de servir des documents statique depuis une API RESt comme des images ou un pdf par exemple. Les autres middlewares auparavant intégrés à express sont toujours utilisables et maintenus par l'équipe express mais aujourd'hui ils sont disponibles sous la forme de dépendances extérieures qu'il faut installer.

5. **Les Middlewares tiers**

   > Il s'agit de tous les middlewares disponibles sous la forme d'une dépedance extérieure. En gros ces middlewares sont des modules javascript qu'il faudra installer dans notre dossier node_modules comme n'importe quelle autre dépendance du projet. Il existe un nombre important de middlewares déjà prêt à l'emploi.

---

# Un middleware bien pratique

- Morgan permet d'afficher pleins d'informations quant aux requêtes faites sur nos endpoints.
  `npm i morgan --save-dev`

```
app.use(morgan("dev"));
```

> On obtiendra `GET /api/pokemons 200 3.855 ms - 2203` dans le terminal en local!

---

## Interconnexion des middlewares

> Une des forces majeure des middlewares est qu'ils peuvent être combinés entre eux et ainsi former une chaîne de traitement complète. En fait tous les middlewares sont interconnectés et communiquent entre eux.
> Pour cela chaque requête entrante de notre API REST est transmise au premier middleware de la chaîne puis celui-ci transmet la requête au middleware suivant et ainsi de suite jusqu'au point de terminaison de notre API REST.
> Ensuite le mécanisme est identique pour notre réponse HTTP mais dans le sens inverse.
> Les middlewares communiquent donc entre eux en se transmettant leurs paramètres respectifs mais il est tout à fait possible et même courant de chaîner des middlewares qui ne se transmettent pas d'informations entre eux simplement pour additionner plusieurs traitements les uns à la suite des autres.  
> Il faudra bien penser à appeler la fonction next() pour chaque fonction de traitement de nos middlewares. C'est ce qui permet de transférer l'exécution au middleware suivant dans la chaîne de traitement. Sinon la requête entrante restera bloquée.
> Lorsqu'on appelle un middleware externe, cela est fait pour nous.

```
                .       ^
                .       .
requête HTTP    .       .  Réponse HTTP
                .       .
                v       .
                -----------
                MIDDLEWARE A
                (req, res, next)
                -----------
                .       ^
            req .       .  res
                v       .
                -----------
                MIDDLEWARE B
                (req, res, next)
                -----------
                .       ^
            req .       . res
                v       .
                ----------
                 API REST
```

---

## exemple d'interconnexion de middlewares

> On ajoute un middleware permettant de définir une favicon `npm i serve-favicon --save`. On ne la définit pas comme dépendance de développement car on le voudra en prod.
>
> > ```
> > const favicon = require("serve-favicon");
> > app.use(favicon(__dirname + "/favicon.ico")).use(morgan("dev"));
> >
> > ```

- On on chaîné nos deux middlewares (morgan qui permet d'avoir des messages de logs et favicon qui permet de changer de favicon).

---

## ordres des middlewares

> L'ordre d'execution des Middlewares est extrêmement important. Par exemple, si vous avez un middleware pour les logs, et un autre pour les erreurs, il faut bien sûr activer les logs en premier. Si on le faisait en dernier, on ne loguerait rien du tout! Quand vous faites appel aux Middlewares, réfléchissez donc bien à l'ordre, car cela peut impacter fortement le fonctionnement de l'application.

---

## envoyer des informations

### Il faut préciser

1. **Le type d'action HTTP**
   L'action permettant d'ajouter une nouvelle ressource est POST.
2. **L'url de la ressource**
   C'est l'emplacement de la ressource sur laquelle nous souhaitons intervenir, c'est à dire son URL. Dans notre cas, nous voulons ajouter un élément à la collection de ressources des pokémons ou "ressources pluriels". Concrètement il s'agit de "/api/pokemons".
3. **Les données du pokémon**
   Il s'agit des informations du nouveau pokémon que l'on souhaite ajouter à l'API Rest. du format Json

---

## Attribuer le bon id lors de la création

```
exports.getUniqueId = (pokemons) => {
  const pokemonsIds = pokemons.map((pokemon) => pokemon.id);
  const maxId = pokemonsIds.reduce((a, b) => Math.max(a, b));
  const uniqueId = maxId + 1;

  return uniqueId;
};
```

**Attention: Cette méthode est valable si ce n'est pas la bdd qui effectue le travail**

---

## tester ses endpoins en POST

- Depuis le navigateur on ne peut effectuer que des requêtes get.
  On utilise donc Postman (plus à destination des entreprises) ou insomnia (plus simple, plus développeur friendly)

---

## deux choses à savoir pour manier le json

1. On recoit les données sous la forme de chaîne de caractères

```
const userString = '{"name": "John", "age": 33}'
```

2. On parse la chaîne de caractères afin d'obtenir du JSON

```
const userJson = JSON.parse(userString)
```

---

1. Pour obtenir les données "inverses" que l'on devra retourner au client, on utilise la méthose JSON.stringify

```
console.log(JSON.stringify(userJson)); // {"name": "John", "age": 33}
```

---

**Il faut faire attention**

```
    const user String = '{"name": "John", "age": 33}'
    const userJson = JSON.parse(userString)

    console.log(userJSON.age) //affiche 33
    console.log(userString.age) //affiche 'undefined'
```

> Une chaine de caractères n'aura jamais de propriété 'age' alors que c'est tout à fait possible pour un json!!

### body parser

On utilise donc un MIDDLEWARE nommé `body-parser` pour gérer le parsing pour nous.

> npm install body-parser --save

**On l'ajoute**

```
const bodyParser = require("body-parser");

(...)
//Middleware
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());
(...)
```

---

## Modifier une donnée (PUT)

- Pour modifier une donnée, on ne va pas interragir directement avec la donnée présente dans l'api. à la place, on va recréer un élément modifié et remplacer l'ancien.

> Cela s'explique car si deux utilisateurs modifient un même élément au même moment, il existe un risque de collision. Si chaque client soumet une nouvelle version complète du pokémon les modifications peuvent s'enchaîner les unes à la suite des autres logiquement.
> Autrement dit, chaque modification introduit qu'un seul et unique effet de bord sur le serveur plutôt que des changements de propriétés dans tous les sens.
>
> > Pour modifier seulement une partie d'une ressource il existe une autre opération nommée PATCH. Sans rentrer dans les détails, je vous recommande fortement d'utiliser systématiquement PUT. Il s'agit d'une opération beaucoup plus fiable pour construire votre API Rest et c'est la méthode utilisée par la majorité des API Rest.

```
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
```

### différence de syntaxe entre POST et PUT

```
//ajout d'un pokémon
const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}

//modification d'un pokémon
const pokemonUpdated = {...req.body, id: id}
```

> Dans le Post nous avons des accolades supplémentaires entourant les propriétés ajouté au pokémon. Dans PUT on modifie qu'une seule propriété, il n y a donc pas besoin d'ajouter les accolades.

---

## Delete

````
app.delete("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonDeleted = pokemons.find((pokemon) => pokemon.id === id);
  pokemons = pokemons.filter((pokemon) => pokemon.id !== id);
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`;
  res.json(success(message, pokemonDeleted));
});
```js

> res.json(success(message, pokemonDeleted));

- On retourne le pokémon supprimé, on ne nous reprochera jamais de faire une API rest la plus pointue possible, il est d'ailleurs agréable d'avoir un retour sur la suppression.
````

---

## ORM

- Nous utilisons un ORM

```
                SQL                            Javascript
                ----                           -----------
        INSERT INTO table                       create()
        VALUES ('valuer1, ...)

    BASE DE DONNÉES <---------------- ORM <---------------- API REST

```

> C'est une technique de programmation puissante qui permet de convertir une base de données dans des langages comme le javascript. Cela permet de masquer le fait qu'il y a une base de donnée en arrière plan. On va interagir avec des objets javascript fournit par l'ORM, nul besoin d'apprendre le SQL.

**Avantages de l'orm**

1. Pas besoin de connaître SQL
2. On utilise Javascript
3. Abstraction de la base de données
4. On manipule de simples objets Javascript
5. Requêtes simples comprises: findaAll, findOne, etc.

**sequelize**

- Orm pour Mysql basé sur les promises. Il gère les traitement asynchrones de manière plus efficaces que de simples callbacks. Nous aurons que des traitements asynchrones car dès que nous appellons la BDD il y aura un délai de réponse.
- Sequelize supporte la plupart des bases de données : postgreSql, mysql, sqlite, mssql ...

`npm install sequelize --save`

**ajout d'un driver**

- Sequelize s'occupe pour nous de créer une couche d'abstraction par rapport à la base de données utilisée. Cependant, l'ORM, même si nous ne le voyons pas, doit réellement se connecter à la base de donnée qu'il y a derrière. C'est là que le driver rentre en jeu, chaque base de données SQL a son propre driver afin de permettre à l'orm d'interragir avec elle.
  Nous utilisons Xammp, la base de donnée est MariaDb il faut donc installer le driver correspondant afin que Sequelize puisse se connecter à la base de données mariaDb présente en local.

`npm install mariadb --save`

**initialisation de l'orm**

```
const { Sequelize } = require("sequelize");
(...)
const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)
```

**4 paramètres**

1. `pokedex`: nom de la base de donnée que l'on souhaite créer.
2. `root`: nom d'utilisateur
3. `''`: mot de passe de la bdd
4. - `host`: obligatoire / précise l'emplacement de la bdd
   - `dialect`: nom du driver
   - `timezone/logging`: permet d'éviter des affichages d'avertissements dans la console, non obligatoire.

**lancer la connexion**

```
sequelize
  .authenticate()
  .then((_) =>
    console.log("La connexion à la base de données a bien été établie.")
  )
  .catch((error) =>
    console.error(`Impossible de se connecter à la base de données : ${error}`)
  );
```

---

## Notions avancée ORM

**Models**

- Les models sont l'essence même de sequelize.
- Un modèle est une abstraction qui représente une table dans notre base de données avec Sequelize on va donc définir un modèle Pokémon qui représentera la table contenant les pokémons du côté de notre base de données.
  Pour être plus concret, un modèle est un objet javascript fournit par sequelize que l'on peut paramétrer en fonction de nos propres besoins.
- Cet objet spécifique contient plusieurs propriétés qui décrivent à sequelize la structure de l'entité qui doit être stockée.
- Par exemple pour un pokémon, cela peut être le fait de sauvegarder son nom, ses points de vies, l'adresse de son image, etc.
- pour chacune de ces propriétés nous devons également renseigner le type de la donnée, string; nombre; date?

**exemple de modele**

```
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
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );
};
```

- Nous exportons une fonction qui possède deux paramètres.
  - `sequelize` : représente notre connexion à la base de données, cet objet possède une propriété define qui permet de déclarer un nouveau modèle auprès de sequelize. Nous utilisons cette méthode define à la ligne 2.
  - `DataTypes` : Permet de définir les types de données de chaque propriété de notre modèle, par exemple, la propriété name contiendra une chaîne de caractère et la propriété contenant des points de vies contiendra des entiers.
- la propriété `define` prend elle même 3 paramètres afin de mettre en place un nouveau modèle. Cette méthode est très importante car Sequelize se base sur les modèles que nous déclarons pour construire les tables dans la base de données sql.
  - ligne 2 : `'pokemon'` : Nous déclarons le modèle pokemon, Sequelize va donc créer la table correspondante (avec un s : pokemons)
  - de id: à types: : La description de notre modèle, chaque propriété deviendra une colonne dans la table pokemons.
  - timesstamps à updatedAt : Option de paramètrrage global.

**mise à jour dans notre code**

```
const { Sequelize, DataTypes } = require("sequelize");
const PokemonModel = require("./src/models/pokemon");

(...)

const Pokemon = PokemonModel(sequelize, DataTypes);

sequelize
  .sync({ force: true })
  .then((_) =>
    console.log('La base de données "Pokedex a bien été synchronisée')
  );

```

**force:true**

- cette option permet de supprimer complétement la table associée à chaque modèle avant d'effecuter une synchronisation en bon et dûe forme. On perd les données de la table entre chaque synchronisation, à terme on se débarassera de cette option. Pour le développement ça aide car on pourra repartir sur des données neuves à chaque redémarrage de notre api.

**ajouter des pokemons**

- Pour remplir notre table pokemons nous allons devoir créer des instances de pokémons grâce à notre modèle sequelize `PokemonModel`.
- Chaque Modèle Sequelize possède une méthode `Create()`, elle permet de créer une nouvelle instance de Pokémon directement en bdd.

```
          Pokemon A
        /           \
TABLE   - Pokemon B - ModelPokemon
        \           / (sequelize)
          Pokemon...
```

**exemple concret**

```
const Pokemon = PokemonModel(sequelize, DataTypes);

sequelize.sync({ force: true }).then((_) => {
  console.log('La base de données "Pokedex a bien été synchronisée');

  Pokemon.create({
    name: "Bulbizarre",
    hp: 25,
    cp: 5,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
    types: ["Plante", "Poison"].join(),
  }).then((bulbizarre) => console.log(bulbizarre.toJSON()));
});
```

- On utilise join car nous avons une chaîne de caractère en bdd, on utilisera split en retour.
- toJSON() cette méthode fournie par sequelize est recommandée pour afficher correctement les informations des instances d'un modèle, en effet, sequelize attache tout un tas de propriétés et de méthodes sur les modèles en interne et la méthode `toJSON()` permet de n'afficher que les valeurs qui nous intéressent.

---

## recherche
> On recherche un pokémon qui commence par le terme de recherche: 
>>${name}%

> On recherche un pokémon qui se termine par le terme de recherche: 
>>%${name}

> On recherche un pokémon qui contient le terme de recherche: 
>>%{name}%
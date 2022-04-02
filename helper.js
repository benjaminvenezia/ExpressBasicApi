exports.success = (message, data) => {
  return {
    message, //message:message
    data,
  };
};

exports.getUniqueId = (pokemons) => {
  const pokemonsIds = pokemons.map((pokemon) => pokemon.id);
  const maxId = pokemonsIds.reduce((a, b) => Math.max(a, b));
  const uniqueId = maxId + 1;

  return uniqueId;
};

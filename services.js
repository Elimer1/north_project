import { getMap } from "./map.js";
import { getGameRepo, startGameRepo, getMapRepo, updateGame } from "./repo.js";
import { battleAlgo } from "./utils.js";

let gameMap;

const startGameService = async (playerName) => {
  if (!playerName) {
    const error = new Error("player name missing");
    error.status = 400;
    throw error;
  }

  gameMap = await getMapRepo();

  let playerTerritories = [];

  gameMap.map((territory) => {
    if (!territory.headquarters) {
      territory.headquarters = false;
      territory.soldiers = 4;
    } else {
      territory.soldiers = 8;
    }
    territory.owner = territory.startOwner;
    if (territory.owner === "player") {
      playerTerritories.push(territory.id);
    }
  });

  const gameDetails = {
    playerName: playerName.trim(),
    round: 1,
    phase: "reinforce",
    status: "playing",
    winner: null,
    territories: playerTerritories,
  };

  const result = await startGameRepo(gameDetails);
  const gameId = result.toString();

  const game = await getGameRepo(gameId);

  return game;
};

await startGameService("new");

export const loadGameService = async (id) => {
  const result = await getGameRepo(id);
  if (!result) {
    const error = new Error("game not found");
    error.status = 404;
    throw error;
  }

  return result;
};

export const reinforceService = async (territoryId, playerId) => {
  const game = await getGameRepo(playerId);
  console.log(game);
  if (!game) {
    const error = new Error("game not found");
    error.status = 404;
    throw error;
  }

  if (game.status !== "playing") {
    const error = new Error("no active game");
    error.status = 400;
    throw error;
  }

  if (game.phase !== "reinforce") {
    const error = new Error("invalid action");
    error.status = 400;
    throw error;
  }

  let soldiersCount;

  gameMap.forEach((territory) => {
    if (territory.id === territoryId) {
      if (territory.owner !== "player") {
        const error = new Error("invalid territory");
        error.status = 400;
        throw error;
      }
      territory.soldiers += 3;
      soldiersCount = territory.soldiers;
    }
  });

  await updateGame(game._id, { phase: "attack" });

  game.phase = "attack";

  return { game, playerEvent: soldiersCount, computerEvents: [] };
};

export const attack = async (gameId, data) => {
  const game = await getGameRepo(gameId);

  if (!game) {
    const error = new Error("game not found");
    error.status = 404;
    throw error;
  }

  if (game.status !== "playing") {
    const error = new Error("no active game");
    error.status = 400;
    throw error;
  }

  if (game.phase !== "attack") {
    const error = new Error("game is not currently in attack phase");
    error.status = 409;
    throw error;
  }

  if (data.skip) {
    await updateGame(gameId, { phase: "move" });
    game.phase = "move";
    return { game, playerEvent: null, computerEvents: [] };
  }

  const { fromId, toId, soldiers } = data;

  if (!Number.isInteger(soldiers)) {
    const error = new Error("soldiers sent must be a whole number");
    error.status = 400;
    throw error;
  }

  if (!game.territory.includes(fromId)) {
    const error = new Error("territory does not belong to player");
    error.status = 400;
    throw error;
  }

  let soldiersDef;
  let targetedTerritory;
  gameMap.map((territory) => {
    if (territory.id === toId) {
      if (!territory.neighbors.includes(fromId)) {
        const error = new Error("not a neighboring territory");
        error.status = 400;
        throw error;
      }
      if (territory.owner === "player") {
        const error = new Error("cannot attack own territory");
        error.status = 400;
        throw error;
      }
      targetedTerritory = territory;
      soldiersDef = territory.soldiers;
    }
  });

  gameMap.map((territory) => {
    if (territory.id === fromId) {
      if (territory.soldiers <= soldiers) {
        const error = new Error(
          "must have at least 1 soldier stay in territory",
        );
        error.status = 409;
        throw error;
      }
    }
  });

  const { winner, soldierSurvivors } = battleAlgo(soldiers, soldiersDef);

  gameMap.map((territory) => {
    if (territory.id === fromId) {
      territory.soldiers -= soldiers;
      if ((winner = "attacker")) {
        game.territories.push(toId);
      }
    }

    if (territory.id === toId) {
      if ((winner = "attacker")) {
        if (territory.headquarters) {
          game.winner = "attacker";
          game.status = "finished";
          gameMap = "";
          return { game };
        }
        territory.owner = "player";
      }
      territory.soldiers = soldierSurvivors;
    }
    game.status = "move";
  });

  await updateGame(gameId, game);
  return { game, playerEvent: soldiers, computerEvents: [] };
};

export const move = async (gameId, data) => {
  const { fromId, toId, soldiers } = data;

  if (!Number.isInteger(soldiers)) {
    const error = new Error("soldiers sent must be a whole number");
    error.status = 400;
    throw error;
  }

  gameMap.map((territory) => {
    if (territory.id === fromId) {
      if (territory.owner !== "player") {
        const error = new Error("both territories must belong to the player");
        error.status = 409;
        throw error;
      }

      if (!territory.neighbors.includes(toId)) {
        const error = new Error("territories must neighbor eachother");
        error.status = 409;
        throw error;
      }

      if (territory.soldiers <= soldiers) {
        const error = new Error(
          "must have at least 1 soldier stay in territory",
        );
        error.status = 409;
        throw error;
      }
    }

    if (territory.id === toId) {
      if (territory.owner !== "player") {
        const error = new Error("both territories must belong to the player");
        error.status = 409;
        throw error;
      }
    }
  });

  const game = await getGameRepo(gameId);
  if (game.status !== "playing") {
    const error = new Error("game must be active");
    error.status = 409;
    throw error;
  }

  gameMap.map((territory) => {
    if (territory.id === fromId) {
      territory.soldiers -= soldiers;
    }
    if (territory.id === toId) {
      territory.soldiers += soldiers;
    }
  });
  return { game, playerEvent: null, computerEvents: [] };
};

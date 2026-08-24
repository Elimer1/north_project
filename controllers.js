import {
  startGameService,
  loadGameService,
  reinforceService,
  attack,
} from "./services.js";

export const startGame = async (req, res, next) => {
  try {
    const { playerName } = req.body;

    const game = await startGameService(playerName);
    return res.status(201).json(game);
  } catch (error) {
    return next(error);
  }
};

export const loadGame = async (req, res, next) => {
  try {
    const id = req.params.id;
    const gameId = JSON.parse(id);
    const result = await loadGameService(gameId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const reinforce = async (req, res, next) => {
  try {
    const { territoryId } = req.body;
    const id = req.params.id;
    const gameId = JSON.parse(id);
    const result = await reinforceService(territoryId, gameId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const attack = async (req, res, next) => {
  try {
    const id = req.params.id;
    const gameId = JSON.parse(id);
    const { fromId, toId, soldiers } = req.body;
    const result = await attack(gameId, { fromId, toId, soldiers });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

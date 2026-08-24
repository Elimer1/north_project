import express from "express";
import { startGame, loadGame, reinforce } from "./controllers.js";

const router = express.Router();

router.post(".games", startGame);
router.get("/games/:id", loadGame);
router.post("/games/:id/reinforce", reinforce);
router.post("/games/:id/attack", attack);
router.post("/games/:id/move", transfer);
router.post("/games/:id/end-turn", endTurn);

export default router;

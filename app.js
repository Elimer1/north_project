import express from "express";
import "dotenv/config";
import cors from "cors";
import router from "./routes.js";
import errorHandler from "./errorHandler.js";
import { closeConnection } from "./mongo.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler());

//closeConnection();

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

// src/index.ts
import express from "express";
import {createServer} from "http";
import cors from "cors";
import {WebSocketServer} from "ws";
import {handleUpgrade} from "./ws/upgrade";
import {configDotenv} from "dotenv";
import {handleConnection} from "./ws/ws-handler";

configDotenv();

const app = express();
const server = createServer(app);
const wsServer = new WebSocketServer({noServer: true});

server.on("upgrade", (request, socket, head) => handleUpgrade(request, socket, head, wsServer));
wsServer.on("connection", handleConnection);

app.use(cors());
app.use(express.json());
server.listen(process.env.PORT, () => console.log(`Server is running on port ${(process.env.PORT)}`));

// Route for fetching the session id
app.get("/sessionId", (_, res) =>
    res.json({message: "Check x-euler-session-id header, which will be present if the extension is installed."})
);
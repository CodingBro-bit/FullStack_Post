import express, { Express } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import bodyParser from 'body-parser'
dotenv.config();
import myapp from "./routes";
import { tables, post_table , comments_table } from "../src/models/queries";
import connection from "./models/myconnection";
import { User } from "../src/models/user";
import cookieParser from 'cookie-parser';
import {WebSocket , WebSocketServer} from 'ws'
import { createServer } from "http";
//passing user in req object
declare global {
    namespace Express {
      interface Request {
        user:User
      }
    }
}

const app: Express = express();
const port = process.env.PORT || 5000;


const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, // Allow credentials (cookies)
};
app.use(cookieParser());
app.use(cors(corsOptions)); 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(myapp);

const server = createServer(app);
export let wss : WebSocketServer;

const startServer = async () =>{
  try {
    
    connection.setTables([tables , post_table , comments_table]);
    await connection.connectTOdb();

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });

    wss = new WebSocketServer({server});
    wss.on(
      "connection" , (ws:WebSocket) => {
        ws.on("message", (message) => {
          console.log("[WebSocket]: Received message:", message.toString());
  
          // Example: Echo the message back to the client
          ws.send(`Server received: ${message}`);
        });
  
        // Handle client disconnections
        ws.on("close", () => {
          console.log("[WebSocket]: A client disconnected");
        });
  
        // Handle errors
        ws.on("error", (err) => {
          console.error("[WebSocket]: An error occurred:", err);
        });
  
        // Send a welcome message to the client
        ws.send("Welcome to the WebSocket server!");
      }      
    );
  } catch (error) {
    console.log('error occured: '+error)
  }
}
startServer();

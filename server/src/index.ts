import express, { Express } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import bodyParser from 'body-parser'
dotenv.config();
import myapp from "./routes";
import { tables, post_table , comments_table } from "../src/models/queries";
import connection from "./models/myconnection";
import { User } from "../src/models/user";

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

app.use(cors(corsOptions)); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(myapp);

const startServer = async () =>{
  try {
    
    connection.setTables([tables , post_table , comments_table]);
    await connection.connectTOdb();

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });

  } catch (error) {
    console.log('error occured: '+error)
  }
}
startServer();

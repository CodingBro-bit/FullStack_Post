import { Connection } from "./db";
import { url } from "./queries";


const connection = new Connection();
try {
    if(url)
        connection.setPool(url);
} catch (error) {
    console.log(error)
}

export default connection;



















































































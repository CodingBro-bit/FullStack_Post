import { Pool } from 'pg';


interface Conn {
    getTables() : string[] ;
    
    getPool():Pool , 
   
}

export class Connection implements Conn{
    private mytables: string[];
    private pool:  Pool;

    constructor() {
        this.mytables = [];
        this.pool = new Pool();
    }
    getPool():Pool{
        return this.pool;
    }
    setPool(url:string):void{
        
        if(url){
            if(this.pool){
                this.pool.end();
            }
            this.pool = new Pool({
                connectionString : url
            })
            console.log("Database pool connection established.");
        }else
        {
            console.log('Invalid url')
        }
    }
    setTables(tables:string[]):void{
        for(let tbl of tables){
            this.mytables.push(tbl);
        }
    }
    getTables():string[]{
        return this.mytables;
    }
    async connectTOdb():Promise<void>{
        let client ;
        try {
            
            client = await this.pool.connect();
            for(let query of this.mytables ){
                client.query(query);
            }
            console.log("Tables created successfully");
            
        } catch (error) {
            console.error('Error executing queries', error);
        }finally{
            if(client){
                await client.release();
            }
        }
    }
}


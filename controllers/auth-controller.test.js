import mongoose from "mongoose";
import app from '../app.js';
import ctrl from '../../controllers/auth-controller.js' 

const {TEST_DB_HOST, PORT=3000 }= process.env;

describe('test login controller', ()=>{
    let server = null;
    beforeAll (async()=>{
        await mongoose.connect(TEST_DB_HOST);
        server = app.listen(PORT);
    });

    afterAll (async ()=>{
        await mongoose.connection.close();
        server.close();
    })
})



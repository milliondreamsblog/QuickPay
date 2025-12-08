import express from 'express';
import cors from 'cors';

//introduction express server
const app = express();

app.use(cors());
//bodyParser lets you parse json 
app.use(express.json());

import mainRouter from './routes/index.js'

app.use("/api/v1" , mainRouter);

app.listen(3000);
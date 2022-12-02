import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';
import { router } from './routes/pageRoutes.js';
import { MDBConnection } from './config/mongoDBConnection.js';
import { localVarFunc } from './middlewares/locatVariales.js';
import cookieParser from 'cookie-parser';
//========================= config dotenv
dotenv.config();
//========================= create port
const port = process.env.PORT || 5000;
//========================= create app
const app = express();
//=========================use app for json and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//========================= app use for session
app.use(
  session({
    secret: 'Nothing',
    saveUninitialized: true,
    resave: false,
  })
);
//========================= use local variable
app.use(localVarFunc);
app.use(cookieParser());

//========================= app set for ejs/ use ejs-layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/app');
//=========================== app use for routes

app.use(router);
//=========================== static public folder

app.use(express.static('public'));

//===================================create server
app.listen(port, () => {
  MDBConnection();
  console.log(`Server is Running on Port ${port}`.bgMagenta);
});

import express, { Application} from 'express';
import conciliacionRoutes from './routes/offers';
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
import {Router} from 'express';
const router = Router();
import { passport } from './database';
import { LocalStrategy } from './database';

const { database } = require('./db');
const app: Application = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false})); 

// Configurar cabeceras y cors
 router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    app.locals.user = req.body.user;
    next();
});



// Routes
app.use(conciliacionRoutes);

app.use(require('cookie-parser')());
//Settings Session Express


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('serve-static')(__dirname + 'public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  store: new MySQLStore(database)
}));


//Port
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
	console.log('Server is in port', app.get('port'));
});


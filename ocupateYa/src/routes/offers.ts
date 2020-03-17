import {Router} from 'express';
const router = Router();

import { login } from '../controllers/main.controller';
import { register } from '../controllers/main.controller';
import { recordDetails } from '../controllers/main.controller';
import { postulaciones } from '../controllers/main.controller';
import { adicionarOferta } from '../controllers/main.controller';
import { buscarOfertas } from '../controllers/main.controller';
import { insercionEstudios } from '../controllers/main.controller';
import { insercionExperienciaLaboral } from '../controllers/main.controller';
import { insercionReferenciaFamiliar } from '../controllers/main.controller';
import { cargarAreas } from '../controllers/main.controller';
import { cargarCiudades } from '../controllers/main.controller';
import { menu } from '../controllers/main.controller';
import { cargarOfertasEstadoCero } from '../controllers/main.controller';
import { cargarContratos } from '../controllers/main.controller';
import { cargarJornadas } from '../controllers/main.controller';
import { cargarCargosEmpresas } from '../controllers/main.controller';
import { actualizarOferta } from '../controllers/main.controller';
import { passport } from '../database'; 

router.get('/areas',cargarAreas)
router.get('/ciudades',cargarCiudades)
router.get('/menu',menu)
router.get('/tipocontrato',cargarContratos)
router.get('/tipojornada',cargarJornadas)




/* Métodos POST */


router.route('/login').post(login)
router.route('/register').post(register)
router.route('/recordDetails').post(recordDetails)
router.route('/apply').post(postulaciones)
router.route('/addoffer').post(adicionarOferta)
router.route('/search').post(buscarOfertas)
router.route('/addstudies').post(insercionEstudios)
router.route('/addworkexperience').post(insercionExperienciaLaboral)
router.route('/addfamiliyref').post(insercionReferenciaFamiliar)
router.route('/loadofferzero').post(cargarOfertasEstadoCero)
router.route('/loadcargos').post(cargarJornadas)
router.route('/loadcargosempresas').post(cargarCargosEmpresas)
router.route('/updateoffer').post(actualizarOferta)



import express, { Application} from 'express';


const app: Application = express();

router.use(passport.initialize());
router.use(passport.session());

   
router.post('/loginPassport', (req, res, next) => {
      passport.authenticate('local.login', {
      successRedirect: '/dashboard',
      failureRedirect: '/index',
      failureFlash: true
    })(req, res, next);
  }); 

router.post('/registerUser', passport.authenticate('local.register', {
    successRedirect: '/ok',
    failureRedirect: '/failed',
    failureFlash: false,
   
}));

router.get('/logout', (req:any, res) => {
  req.logOut();
  res.redirect('/redirected');
});
  
export default router;

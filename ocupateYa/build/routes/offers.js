"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const main_controller_1 = require("../controllers/main.controller");
const main_controller_2 = require("../controllers/main.controller");
const main_controller_3 = require("../controllers/main.controller");
const main_controller_4 = require("../controllers/main.controller");
const main_controller_5 = require("../controllers/main.controller");
const main_controller_6 = require("../controllers/main.controller");
const main_controller_7 = require("../controllers/main.controller");
const main_controller_8 = require("../controllers/main.controller");
const main_controller_9 = require("../controllers/main.controller");
const main_controller_10 = require("../controllers/main.controller");
const main_controller_11 = require("../controllers/main.controller");
const main_controller_12 = require("../controllers/main.controller");
const main_controller_13 = require("../controllers/main.controller");
const main_controller_14 = require("../controllers/main.controller");
const main_controller_15 = require("../controllers/main.controller");
const main_controller_16 = require("../controllers/main.controller");
const main_controller_17 = require("../controllers/main.controller");
const database_1 = require("../database");
router.get('/areas', main_controller_10.cargarAreas);
router.get('/ciudades', main_controller_11.cargarCiudades);
router.get('/menu', main_controller_12.menu);
router.get('/tipocontrato', main_controller_14.cargarContratos);
router.get('/tipojornada', main_controller_15.cargarJornadas);
/* Métodos POST */
router.route('/login').post(main_controller_1.login);
router.route('/register').post(main_controller_2.register);
router.route('/recordDetails').post(main_controller_3.recordDetails);
router.route('/apply').post(main_controller_4.postulaciones);
router.route('/addoffer').post(main_controller_5.adicionarOferta);
router.route('/search').post(main_controller_6.buscarOfertas);
router.route('/addstudies').post(main_controller_7.insercionEstudios);
router.route('/addworkexperience').post(main_controller_8.insercionExperienciaLaboral);
router.route('/addfamiliyref').post(main_controller_9.insercionReferenciaFamiliar);
router.route('/loadofferzero').post(main_controller_13.cargarOfertasEstadoCero);
router.route('/loadcargos').post(main_controller_15.cargarJornadas);
router.route('/loadcargosempresas').post(main_controller_16.cargarCargosEmpresas);
router.route('/updateoffer').post(main_controller_17.actualizarOferta);
const express_2 = __importDefault(require("express"));
const app = express_2.default();
router.use(database_1.passport.initialize());
router.use(database_1.passport.session());
router.post('/loginPassport', (req, res, next) => {
    database_1.passport.authenticate('local.login', {
        successRedirect: '/dashboard',
        failureRedirect: '/index',
        failureFlash: true
    })(req, res, next);
});
router.post('/registerUser', database_1.passport.authenticate('local.register', {
    successRedirect: '/ok',
    failureRedirect: '/failed',
    failureFlash: false,
}));
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/redirected');
});
exports.default = router;

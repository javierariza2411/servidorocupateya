"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const conciliacion_controller_1 = require("../controllers/conciliacion.controller");
router.post('/conciliacionAutomatica', conciliacion_controller_1.procesarConciliacionesAutomaticas);
router.get('/conciliacion/:id', conciliacion_controller_1.createConciliacion);
router.post('/conciliacionManual', conciliacion_controller_1.createConciliacionManual);
exports.default = router;

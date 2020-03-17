"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const consignaciones_controller_1 = require("../controllers/consignaciones.controller");
router.get('/consignaciones', consignaciones_controller_1.getUsers);
router.get('/consignaciones/:id', consignaciones_controller_1.getUserById);
exports.default = router;

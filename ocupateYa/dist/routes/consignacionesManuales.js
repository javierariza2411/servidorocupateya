"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const consignacionesManuales_controller_1 = require("../controllers/consignacionesManuales.controller");
router.get('/consignacionesManuales', consignacionesManuales_controller_1.getConsignacionesManuales);
router.get('/consignacionesManuales/:id', consignacionesManuales_controller_1.getConsignacionesManualesById);
exports.default = router;

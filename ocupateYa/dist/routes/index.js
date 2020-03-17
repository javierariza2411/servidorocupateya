"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const index_controller_1 = require("../controllers/index.controller");
router.get('/consignaciones', index_controller_1.getUsers);
router.get('/consignaciones/:id', index_controller_1.getUserById);
exports.default = router;

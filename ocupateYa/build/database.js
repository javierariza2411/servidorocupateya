"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mariadb = require('mariadb');
const express_1 = __importDefault(require("express"));
exports.app = express_1.default();
exports.md5 = require('md5');
exports.router = express_1.default.Router();
exports.ip = require("ip");
exports.MobileDetect = require('mobile-detect');
exports.device = require('express-device');
exports.DeviceDetector = require('node-device-detector');
exports.mobileBrowser = require('detect-mobile-browser');
exports.path = require('path');
exports.morgan = require('morgan');
exports.bodyParser = require('body-parser');
exports.passport = require('passport');
exports.LocalStrategy = require('passport-local').Strategy;
exports.nodemailer = require("nodemailer");
exports.pool = exports.mariadb.createPool({
    user: 'ocupateya',
    host: 'technisoftware.com',
    password: '1234567890',
    database: 'ocupateya',
    port: '3306',
    multipleStatements: true
});

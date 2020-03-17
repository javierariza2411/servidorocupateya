export const mariadb = require('mariadb');
import express from 'express';
export const app = express();
export const md5 = require('md5');
export const router = express.Router();
export var ip = require("ip");
export var MobileDetect = require('mobile-detect');
export var device = require('express-device');
export const DeviceDetector = require('node-device-detector');
export var mobileBrowser = require('detect-mobile-browser');
export const path = require('path');
export var morgan = require('morgan');
export var bodyParser = require('body-parser');
export var passport = require('passport');
export var LocalStrategy = require('passport-local').Strategy;
export const nodemailer = require("nodemailer");



export const pool = mariadb.createPool({
    user: 'ocupateya',
    host: 'technisoftware.com',
    password: '1234567890',
    database: 'ocupateya',
    port: '3306',
    multipleStatements: true
});

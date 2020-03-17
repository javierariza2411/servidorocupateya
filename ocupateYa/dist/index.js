"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consignaciones_1 = __importDefault(require("./routes/consignaciones"));
const conciliacion_1 = __importDefault(require("./routes/conciliacion"));
const consignacionesManuales_1 = __importDefault(require("./routes/consignacionesManuales"));
const app = express_1.default();
// middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
// Routes
app.use(consignaciones_1.default);
app.use(conciliacion_1.default);
app.use(consignacionesManuales_1.default);
app.listen(3000);
console.log('Server on port', 5101);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
exports.createConciliacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield database_1.pool.query('select public.conciliar($1)', [id]);
        res.json(`conciliacion Successfully`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
exports.procesarConciliacionesAutomaticas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.pool.query('select public.conciliacionespendientes()');
        res.json(`conciliacion Successfully`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
exports.createConciliacionManual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idConsignacion, listRecaudos } = req.body;
        console.log('idConsignacion: ' + idConsignacion);
        console.log('lista Recaudos:' + listRecaudos);
        yield database_1.pool.query('SELECT public.conciliarmanual($1,$2)', [idConsignacion, listRecaudos]);
        res.json(`conciliacion manual Successfully`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
'SELECT public.conciliarmanual(:consignacion,:_arr)';

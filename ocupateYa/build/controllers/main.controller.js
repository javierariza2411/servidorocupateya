"use strict";
/*===============================
=            IMPORTS            =
===============================*/
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
const database_2 = require("../database");
const database_3 = require("../database");
const database_4 = require("../database");
const database_5 = require("../database");
const database_6 = require("../database");
const ipv4 = database_3.ip.address();
/*=====  End of IMPORTS  ======*/
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// current year
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
// current minutes
let minutes = date_ob.getMinutes();
// current seconds
let seconds = date_ob.getSeconds();
const dateinit = year + "-" + month + "-" + date;
const horainit = hours + ":" + minutes + ":" + seconds;
/*----------  Función Login ----------*/
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataPost = req.body;
        var email = req.body.email;
        var pass = database_2.md5(req.body.password);
        const sql = yield database_1.pool.query("SELECT email FROM usuarios WHERE email = ? ", email);
        if (sql[0] == undefined) {
            return res.json({
                success: false,
                info: "E-mail no registrado"
            });
        }
        else {
            const sql = yield database_1.pool.query("SELECT email, password FROM usuarios WHERE estado = 'ACTIVO' AND email = ? ", [email, pass]);
            if (sql[0] == undefined) {
                return res.json({
                    success: false,
                    info: "Usuario Inactivo"
                });
            }
            else {
                const sql = yield database_1.pool.query("SELECT email, password FROM usuarios WHERE email = ? AND password = ? ", [email, pass]);
                if (sql[0] == undefined) {
                    return res.json({
                        success: false,
                        info: "Password Inválido."
                    });
                }
                else {
                    return res.json({
                        success: true,
                        info: "Acceso Correcto."
                    });
                }
            }
        }
    });
}
exports.login = login;
/*----------  Función Login ----------*/
/*----------  Función Registro ----------*/
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var pnombre = req.body.pnombre;
        var papellido = req.body.papellido;
        var movil = req.body.movil;
        var email = req.body.email;
        var contras = database_2.md5(req.body.password);
        var idarea = req.body.idarea;
        const sql = yield database_1.pool.query("SELECT email FROM usuarios WHERE email = ? ", email);
        if (sql[0] != undefined) {
            return res.json({
                success: false,
                info: "El usuario ya se encuentra registrado!"
            });
        }
        else {
            var query = "CALL sp_insertUsuario(?,?,?,?,?)";
            const result = yield database_1.pool.query(query, [pnombre, papellido, movil, dateinit, idarea]);
            const lastid = yield database_1.pool.query("CALL sp_MaxUsuario()");
            var maxIdUsu = lastid[0][0].maxId;
            var sqlUsuario = "CALL sp_insertUsuarioTbl(?,?,?,?,?)";
            const sqlNewUsuario = yield database_1.pool.query(sqlUsuario, [maxIdUsu, '2', email, '1', contras]);
            if (sqlNewUsuario.affectedRows == 1) {
                res.json({ success: true, info: "Registro Correcto" });
                const transporter = database_4.nodemailer.createTransport({
                    host: "smtp.hostinger.co",
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'setting@pever.co',
                        pass: ':Pgz`CEX'
                    }
                });
                const info = yield transporter.sendMail({
                    from: '"Ocupate Ya" setting@pever.co',
                    to: email,
                    subject: pnombre + " te damos la bienvenida a Ocúpate Ya",
                    text: "Registro de usuarios",
                    html: "<h3>" + pnombre + " confirma tu registro con el siguiente enlace" + "</h3>" +
                        "<h3>Click para confirmar el registro.</h3>" +
                        "<a href='http://localhost:3000/validate/" + maxIdUsu + " '>AQUI</a>"
                });
                console.log("Message sent: %s", info.messageId);
                return (null);
            }
        }
    });
}
exports.register = register;
/*----------  Función Registro ----------*/
/*----------  Función Ingresar Detalles de Usuario  ----------*/
function recordDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var documento = req.body.documento;
        const doc = yield database_1.pool.query("SELECT documento FROM detalle_usuarios WHERE documento = ?;", [documento]);
        if (doc[0] != undefined) {
            res.json({ success: false, info: "Este documento ya se encuentra registrado!" });
        }
        else {
            var idusuario = req.body.id;
            var pnombre = req.body.pnombre;
            var snombre = req.body.snombre;
            var papellido = req.body.papellido;
            var sapellido = req.body.sapellido;
            var tipodoc = req.body.tipodoc;
            var documento = req.body.documento;
            var fecha_expedicion = req.body.fecha_expedicion;
            var idciudad_expedicion = req.body.idciudad_expedicion;
            var fechanac = req.body.fechanac;
            var idgenero = req.body.idgenero;
            var estadocivil = req.body.estadocivil;
            var idciudad = req.body.idciudad;
            var direccion = req.body.direccion;
            var foto = req.body.foto;
            const details = yield database_1.pool.query("CALL sp_AdicionarDetallesUsuario(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [idusuario, pnombre, snombre, papellido, sapellido, tipodoc, documento, fecha_expedicion, idciudad_expedicion, fechanac, idgenero, estadocivil, idciudad, direccion, foto, dateinit]);
            if (details) {
                res.json({ success: true, info: "Actualización de datos correcta" });
                const update = yield database_1.pool.query("UPDATE usuarios SET estado_postulacion = 2 WHERE id = ? ", [idusuario]);
            }
        }
    });
}
exports.recordDetails = recordDetails;
/*----------  Función Ingresar Detalles de Usuario  ----------*/
/*----------  Función Buscar Oferta  ----------*/
exports.buscarOfertas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var idarea = req.body.idarea;
        var idciudad = req.body.idciudad;
        const ofertas = yield database_1.pool.query("CALL sp_BuscarOferta(?,?)", [idarea, idciudad]);
        if (ofertas[0][0] == undefined) {
            res.json({ success: false, info: "No hay resultados con los parámetros ingresados!" });
        }
        else {
            res.json({ success: true, data: ofertas[0] });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
/*----------  Función Buscar Oferta  ----------*/
/*----------  Función Postularse ----------*/
function postulaciones(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var idusuario = req.body.idusuario;
        var idoferta = req.body.idoferta;
        const maxId = yield database_1.pool.query("CALL sp_MaxIdPostulacion()");
        var maxIdPostulacion = maxId[0][0].max + 1;
        const sql = yield database_1.pool.query("SELECT p.id FROM postulaciones p WHERE p.idusuario = ? AND p.idoferta = ? AND p.idestado_postulacion = 1", [idusuario, idoferta]);
        if (sql[0] != undefined) {
            return res.json({
                success: false,
                info: "Usted ya aplicó a esta oferta laboral!"
            });
        }
        else {
            const postulacion = yield database_1.pool.query("CALL sp_PostulacionUsuario(?,?,?,?,?,?)", [maxIdPostulacion, idusuario, idoferta, dateinit, horainit, '8']);
            if (postulacion) {
                res.json({ success: true, info: "Postulación Exitosa" });
                yield database_1.pool.query("UPDATE usuarios SET estado_postulacion = 8 WHERE id = ? ", [idusuario]);
                return res.json({
                    success: true,
                    info: "Postulación Exitosa!"
                });
            }
        }
    });
}
exports.postulaciones = postulaciones;
/*----------  Función Postularse ----------*/
/*----------  Función Adcionar Oferta POST  ----------*/
exports.adicionarOferta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const maxId = yield database_1.pool.query("CALL sp_MaxIdOferta()");
    var maxIdOffer = maxId[0][0].maxId + 1;
    var idarea = req.body.idarea;
    var idcargo_empresa = req.body.idcargo_empresa;
    var idciudad = req.body.idciudad;
    var idcontrato = req.body.idcontrato;
    var idtipo_jornada = req.body.idtipo_jornada;
    var idestado_oferta = '0';
    var oferta = req.body.oferta;
    var descripcion = req.body.descripcion;
    var salarioini = req.body.salarioini;
    var salariofin = req.body.salariofin;
    var idusuario_sis = req.body.idusuario_sis;
    var vacante = req.body.vacante;
    var fecha_publicacion = year + "-" + month + "-" + date;
    var hora_publicacion = horainit;
    const data = [maxIdOffer, idarea, idcargo_empresa, idciudad, idcontrato, idtipo_jornada, idestado_oferta, oferta, descripcion, salarioini, salariofin, idusuario_sis, vacante, fecha_publicacion, hora_publicacion];
    const dataInter = [maxIdOffer, 0, idusuario_sis, fecha_publicacion, hora_publicacion, idusuario_sis, fecha_publicacion, hora_publicacion, null];
    yield database_1.pool.query("CALL sp_adicionarOferta(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", data);
    const addOfferInter = yield database_1.pool.query("CALL sp_addOfferInter(?,?,?,?,?,?,?,?,?)", dataInter);
    if (addOfferInter) {
        res.json({
            success: true,
            info: "Registro Correcto"
        });
    }
});
/*----------  Función Adcionar Oferta POST  ----------*/
/*----------  Función Cargar Areas  ----------*/
exports.cargarAreas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const areas = yield database_1.pool.query("CALL `sp_Areas`();");
        if (areas) {
            res.json({ success: true, data: areas[0] });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
/*----------  Función Cargar Areas ----------*/
/*----------  Función Cargar Ciudades  ----------*/
exports.cargarCiudades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ciudades = yield database_1.pool.query("CALL `sp_Ciudad`();");
        if (ciudades) {
            res.json({ success: true, data: ciudades[0] });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
/*----------  Función Cargar Ciudades ----------*/
/*----------  Función Cargar Tipo de Contrato  ----------*/
exports.cargarContratos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contratos = yield database_1.pool.query("SELECT id, tipo_contrato FROM tipo_contrato WHERE estado = 'ACTIVO' ORDER BY tipo_contrato;");
        if (contratos[0] != undefined) {
            res.json({ success: true, data: contratos });
        }
        else {
            res.json({ success: false, info: "No hay registros" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
/*----------  Función Cargar Tipo de Contrato ----------*/
/*----------  Función Cargar Tipo de Jornada  ----------*/
exports.cargarJornadas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jornadas = yield database_1.pool.query("SELECT id, tipo_jornada FROM tipo_jornada WHERE estado = 'ACTIVO' ORDER BY tipo_jornada");
        if (jornadas[0] != undefined) {
            res.json({ success: true, data: jornadas });
        }
        else {
            res.json({ success: false, info: "No hay registros" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
/*----------  Función Cargar Tipo de Jornada ----------*/
/*----------  Función Ingresar Estudios  ----------*/
exports.insercionEstudios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var idusuario = req.body.idusuario;
        var idnivel_formativo = req.body.idnivel_formativo;
        var idarea_estudio = req.body.idarea_estudio;
        var idinstitucion = req.body.idinstitucion;
        var titulo = req.body.titulo;
        var fecha_inicio = req.body.fecha_inicio;
        var fecha_fin = req.body.fecha_fin;
        var fecha_registro = dateinit;
        var hora_registro = horainit;
        const estudios = yield database_1.pool.query("CALL sp_AdicionarEstudios(?,?,?,?,?,?,?,?,?);", [idusuario, idnivel_formativo, idarea_estudio, idinstitucion, titulo, fecha_inicio, fecha_fin, fecha_registro, hora_registro]);
        if (estudios) {
            res.json({ success: true, info: "Registro Correcto" });
            yield database_1.pool.query("UPDATE usuarios SET estado_postulacion = 3 WHERE id = ? ", [idusuario]);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error !!!');
    }
});
/*----------  Función Ingresar Estudios ----------*/
/*----------  Función Ingresar Experiencia Laboral  ----------*/
exports.insercionExperienciaLaboral = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var idusuario = req.body.idusuario;
        var empresa = req.body.empresa;
        var cargo = req.body.cargo;
        var fecha_desde = req.body.fecha_desde;
        var fecha_hasta = req.body.fecha_hasta;
        var fecha_registro = dateinit;
        var hora_registro = horainit;
        const explaboral = yield database_1.pool.query("CALL sp_AdicionarExpLaboral(?,?,?,?,?,?,?);", [idusuario, empresa, cargo, fecha_desde, fecha_hasta, fecha_registro, hora_registro]);
        if (explaboral) {
            res.json({ success: true, info: "Registro Correcto!" });
            yield database_1.pool.query("UPDATE usuarios SET estado_postulacion = 13 WHERE id = ? ", [idusuario]);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error !!!');
    }
});
/*----------  Función Ingresar Experiencia Laboral ----------*/
/*----------  Función Ingresar Referencias Familiares ----------*/
exports.insercionReferenciaFamiliar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var idusuario = req.body.idusuario;
        var parentesco = req.body.idpar;
        var movil = req.body.movil;
        var fecha_registro = dateinit;
        var hora_registro = horainit;
        const reflaboral = yield database_1.pool.query("CALL sp_AdicionarReferenciaFamiliar(?,?,?,?,?);", [idusuario, parentesco, movil, fecha_registro, hora_registro]);
        if (reflaboral) {
            res.json({ success: true, info: "Registro Correcto" });
            yield database_1.pool.query("UPDATE usuarios SET estado_postulacion = 5 WHERE id = ? ", [idusuario]);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error !!!');
    }
});
/*----------  Función Ingresar Referencias Familiares ----------*/
/*----------  Función Menu  ----------*/
exports.menu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menu = yield database_1.pool.query("SELECT * FROM menu a left JOIN menu_padre b ON a.idmenupadre=b.id;");
        if (menu) {
            res.json({ menu });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
/*----------  Función Menu ----------*/
/*----------  Función Cargar Cargos Empresas  ----------*/
exports.cargarCargosEmpresas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var idempresa = req.body.idempresa;
        const cargos = yield database_1.pool.query("SELECT id, cargo FROM cargos_empresas WHERE idempresa = ? AND estado = 'ACTIVO' ORDER BY cargo", idempresa);
        if (cargos) {
            res.json({ success: true, data: cargos });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
/*----------  Función Cargar Cargos Empresas  ----------*/
/*----------  Función Cargar Ofertas Estado Cero ----------*/
exports.cargarOfertasEstadoCero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var idempresa = req.body.idempresa;
        const ofertas = yield database_1.pool.query("CALL sp_loadOffers_0(?);", idempresa);
        if (ofertas[0][0] != undefined) {
            res.json({ success: true, data: ofertas[0] });
        }
        else {
            res.json({ success: false, info: "No hay datos registrados" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
/*----------  Función Cargar Ofertas Estado Cero   ----------*/
/*----------  Función Actualizar Oferta  ----------*/
exports.actualizarOferta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var idoferta = req.body.idoferta;
        var idusuario_sis = req.body.idusuario_sis;
        const update = yield database_1.pool.query("CALL sp_UpdateOffer(?,?)", idoferta, idusuario_sis);
        console.log(req.body);
        if (update) {
            res.json({ success: true, info: "Actualización correcta" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error');
    }
});
/*----------  Función Actualizar Oferta  ----------*/
/*==============================================
=            Autenticación Passport            =
==============================================*/
database_5.passport.use('local.login', new database_6.LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => { var password; return __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield database_1.pool.query('SELECT * FROM usuarios WHERE email = ?', [username]);
    const user = rows[0];
    password = database_2.md5(req.body.password);
    if (rows.length > 0) {
        if (password === rows[0].password) {
            const rowssession = yield database_1.pool.query('CALL sp_MaxIdSession()');
            var maxses = rowssession[0][0].maximo + 1;
            var dataok = [maxses, rows[0].id, ipv4, dateinit, horainit, dateinit, horainit, "EXITOSA"];
            const sessionOK = yield database_1.pool.query("CALL sp_insertLogSession(?,?,?,?,?,?,?,?)", dataok);
            done(null, user);
            console.log(req.session.passport.user);
        }
        else {
            console.log("Password Inválido");
            const rowssession = yield database_1.pool.query('CALL sp_MaxIdSession()');
            var maxses = rowssession[0][0].maximo + 1;
            var data = [maxses, rows[0].id, ipv4, dateinit, horainit, dateinit, horainit, 'SI'];
            const insertsessionFailed = yield database_1.pool.query("CALL sp_insertLogSesionFallida(?,?,?,?,?,?,?,?)", data);
        }
    }
    else {
        done(null, false);
        console.log("email no registrado");
    }
}); }));
database_5.passport.use('local.register', new database_6.LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { pnombre, papellido, movil, idarea } = req.body;
    const lastid = yield database_1.pool.query("CALL sp_MaxUsuario()");
    const maxIdUsu = lastid[0][0].maxId;
    let newUser = {
        pnombre,
        papellido,
        movil,
        username,
        password,
        idarea,
        id: maxIdUsu
    };
    newUser.password = database_2.md5(password);
    // Saving in the Database
    const validar = yield database_1.pool.query('SELECT email FROM usuarios WHERE email = ? AND estado = "ACTIVO" ', [username]);
    if (validar[0] != undefined) {
        console.log("Usuario registrado");
        done(null, false);
    }
    else {
        /* const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.co",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'setting@pever.co', // generated ethereal user
              pass: ':Pgz`CEX' // generated ethereal password
            }
        });

        const info = await transporter.sendMail({
            from: '"Ocupate | Ya" setting@pever.co', // sender address
            to: username, // list of receivers
            subject: pnombre + " te damos la bienvenida a Ocupaye YA", // Subject line
            text: "Email de prueba", // plain text body
            html: "body"
        });
            
            console.log("Message sent: %s", info.messageId); */
        newUser.id = maxIdUsu;
        console.log(newUser);
        return done(null, newUser);
    }
})));
database_5.passport.serializeUser((user, done) => {
    done(null, user.id);
});
database_5.passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const query = yield database_1.pool.query('SELECT id, email FROM usuarios WHERE id = ?', [id]);
    done(null, query);
    console.log(query);
}));
/*=====  End of Autenticación Passport  ======*/

/*===============================
=            IMPORTS            =
===============================*/

import { Request, Response } from 'express';
import { pool } from '../database';
import { md5 } from '../database';
import { ip } from '../database';
import { morgan } from '../database';
import { app } from '../database';
import { bodyParser } from '../database';
import router from '../routes/offers';
import { nodemailer } from '../database';
import  { Data } from '../Data';
import { passport } from '../database';
import { LocalStrategy } from '../database';
const ipv4 = ip.address();

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

export async function login(req: Request, res: Response){

    const dataPost: Data = req.body;
    var email = req.body.email;
    var pass = md5(req.body.password);
    const sql = await pool.query("SELECT email FROM usuarios WHERE email = ? ", email);
    
    if(sql[0] == undefined) 
    {
        return res.json({
            success: false,
            info: "E-mail no registrado"
        })
    }
    else
    {
        const sql = await pool.query("SELECT email, password FROM usuarios WHERE estado = 'ACTIVO' AND email = ? ", [email, pass]);
        
        if (sql[0] == undefined) 
        {
            return res.json({
                success: false,
                info: "Usuario Inactivo"
            })     
        }
        else
        {
            const sql = await pool.query("SELECT email, password FROM usuarios WHERE email = ? AND password = ? ", [email, pass]);

            if (sql[0] == undefined) 
            {
                return res.json({
                    success: false,
                    info: "Password Inválido."
                })
            }
            else
            {
                return res.json({
                    success: true,
                    info: "Acceso Correcto."
                })
            }
            
        } 
    } 
}

/*----------  Función Login ----------*/


/*----------  Función Registro ----------*/

export async function register(req: Request, res: Response){
    var pnombre     = req.body.pnombre;
    var papellido   = req.body.papellido;
    var movil       = req.body.movil;
    var email       = req.body.email;
    var contras     = md5(req.body.password);
    var idarea      = req.body.idarea;
    
    
    const sql = await pool.query("SELECT email FROM usuarios WHERE email = ? ", email);
    
    if (sql[0] != undefined) 
    {
        
        return res.json({
            success: false,
            info: "El usuario ya se encuentra registrado!"
        })
    }
    else
    {
        var query = "CALL sp_insertUsuario(?,?,?,?,?)";

        const result = await pool.query(query, [pnombre, papellido, movil, dateinit, idarea ]); 
        
        const lastid    = await pool.query("CALL sp_MaxUsuario()");
        var maxIdUsu    = lastid[0][0].maxId;
    
        var sqlUsuario = "CALL sp_insertUsuarioTbl(?,?,?,?,?)";

        const sqlNewUsuario = await pool.query(sqlUsuario, [maxIdUsu, '2', email, '1' , contras ]);

        if (sqlNewUsuario.affectedRows == 1) 
        {
            res.json({success: true, info: "Registro Correcto"});
            const transporter = nodemailer.createTransport({
                host: "smtp.hostinger.co",
                port: 587,
                secure: false,
                auth: {
                    user: 'setting@pever.co', 
                    pass: ':Pgz`CEX' 
                }
            });

            const info = await transporter.sendMail({
                from: '"Ocupate Ya" setting@pever.co', 
                to: email,
                subject: pnombre + " te damos la bienvenida a Ocúpate Ya",
                text: "Registro de usuarios",
            html: "<h3>"+ pnombre + " confirma tu registro con el siguiente enlace" + "</h3>"+                    
                "<h3>Click para confirmar el registro.</h3>"+
                "<a href='http://localhost:3000/validate/"+ maxIdUsu +" '>AQUI</a>"
            });
        
                console.log("Message sent: %s", info.messageId);
                return (null);                    
        }    
    } 
}

/*----------  Función Registro ----------*/


/*----------  Función Ingresar Detalles de Usuario  ----------*/

export async function recordDetails(req: Request, res: Response){
    
    var documento = req.body.documento;
    const doc = await pool.query("SELECT documento FROM detalle_usuarios WHERE documento = ?;",[documento]);

    if (doc[0] != undefined) 
    {
        res.json({success: false, info: "Este documento ya se encuentra registrado!"});
    }
    else
    {
        var idusuario   = req.body.id;
        var pnombre     = req.body.pnombre;
        var snombre     = req.body.snombre;
        var papellido   = req.body.papellido;
        var sapellido   = req.body.sapellido;
        var tipodoc     = req.body.tipodoc;
        var documento   = req.body.documento;
        var fecha_expedicion   = req.body.fecha_expedicion;
        var idciudad_expedicion   = req.body.idciudad_expedicion;
        var fechanac    = req.body.fechanac;
        var idgenero    = req.body.idgenero;
        var estadocivil = req.body.estadocivil;
        var idciudad      = req.body.idciudad;
        var direccion   = req.body.direccion;
        var foto        = req.body.foto;

        const details = await pool.query("CALL sp_AdicionarDetallesUsuario(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[idusuario,pnombre,snombre, papellido, sapellido,tipodoc, documento, fecha_expedicion, idciudad_expedicion, fechanac, idgenero, estadocivil, idciudad, direccion, foto, dateinit]);

        if(details)
        {
            res.json({success: true, info : "Actualización de datos correcta"});
            const update = await pool.query("UPDATE usuarios SET estado_postulacion = 2 WHERE id = ? ", [idusuario]);
        }      
    }
}

/*----------  Función Ingresar Detalles de Usuario  ----------*/


/*----------  Función Buscar Oferta  ----------*/ 

export const buscarOfertas = async (req: Request, res: Response) => {

    try {
            var idarea = req.body.idarea;
            var idciudad = req.body.idciudad;

            const ofertas = await pool.query("CALL sp_BuscarOferta(?,?)", [idarea, idciudad] ); 

            if (ofertas[0][0] == undefined) 
            {
                res.json({success: false, info: "No hay resultados con los parámetros ingresados!"});
            }
            else
            {
                res.json({success: true, data: ofertas[0]});
            }            
		}   
        catch (error) 
        {
            console.log(error);
            return res.status(500).json('Internal Server error');
        } 
};

/*----------  Función Buscar Oferta  ----------*/ 


/*----------  Función Postularse ----------*/

export async function postulaciones(req: Request, res: Response){

    var idusuario = req.body.idusuario;
    var idoferta  = req.body.idoferta;

    const maxId = await pool.query("CALL sp_MaxIdPostulacion()" ); 

    var maxIdPostulacion = maxId[0][0].max + 1;

    const sql = await pool.query("SELECT p.id FROM postulaciones p WHERE p.idusuario = ? AND p.idoferta = ? AND p.idestado_postulacion = 1", [idusuario, idoferta]);
    
    if(sql[0] != undefined) 
    {
        return res.json({
            success: false,
            info: "Usted ya aplicó a esta oferta laboral!"
        })
    }
    else
    {
        const postulacion = await pool.query("CALL sp_PostulacionUsuario(?,?,?,?,?,?)", [maxIdPostulacion, idusuario, idoferta, dateinit, horainit, '8' ]);

        if(postulacion)
        {
            res.json({success: true, info : "Postulación Exitosa"});
            await pool.query("UPDATE usuarios SET estado_postulacion = 8 WHERE id = ? ", [idusuario]);

            return res.json({
                success: true,
                info: "Postulación Exitosa!"
            })
        }

        
    }
}

/*----------  Función Postularse ----------*/


/*----------  Función Adcionar Oferta POST  ----------*/ 

export const adicionarOferta = async (req: Request, res: Response) => {
        
    const maxId = await pool.query("CALL sp_MaxIdOferta()" ); 
    var maxIdOffer = maxId[0][0].maxId + 1;

    var idarea              = req.body.idarea;
    var idcargo_empresa     = req.body.idcargo_empresa;
    var idciudad            = req.body.idciudad;
    var idcontrato          = req.body.idcontrato;
    var idtipo_jornada      = req.body.idtipo_jornada;
    var idestado_oferta     = '0';
    var oferta              = req.body.oferta;
    var descripcion         = req.body.descripcion;
    var salarioini          = req.body.salarioini;
    var salariofin          = req.body.salariofin;
    var idusuario_sis       = req.body.idusuario_sis;
    var vacante             = req.body.vacante;

    var fecha_publicacion = year + "-" + month + "-" + date;
    var hora_publicacion = horainit;

    const data = [maxIdOffer, idarea, idcargo_empresa, idciudad, idcontrato, idtipo_jornada, idestado_oferta, oferta, descripcion, salarioini, salariofin, idusuario_sis, vacante, fecha_publicacion , hora_publicacion]

    const dataInter = [maxIdOffer, 0, idusuario_sis, fecha_publicacion, hora_publicacion, idusuario_sis, fecha_publicacion, hora_publicacion, null];
 
    await pool.query("CALL sp_adicionarOferta(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",data);

    const addOfferInter = await pool.query("CALL sp_addOfferInter(?,?,?,?,?,?,?,?,?)",dataInter);

    if (addOfferInter) 
    {
        res.json({
            success: true,
            info: "Registro Correcto"
        })
    }   
    
};

/*----------  Función Adcionar Oferta POST  ----------*/


/*----------  Función Cargar Areas  ----------*/

export const cargarAreas = async (req: Request, res: Response) => {

        try
        {    
            const areas = await pool.query("CALL `sp_Areas`();");
            if (areas) 
            {
                res.json({success: true, data: areas[0]});
            }                
		}   
        catch (error) 
        {
            console.log(error);
            return res.status(500).json('Internal Server error');
        } 
};

/*----------  Función Cargar Areas ----------*/


/*----------  Función Cargar Ciudades  ----------*/

export const cargarCiudades = async (req: Request, res: Response) => {

    try
    {    
        const ciudades = await pool.query("CALL `sp_Ciudad`();");
        if (ciudades) 
        {
            res.json({success: true, data: ciudades[0]});
        }                
    }   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error');
    } 
};

/*----------  Función Cargar Ciudades ----------*/


/*----------  Función Cargar Tipo de Contrato  ----------*/

export const cargarContratos = async (req: Request, res: Response) => {

    try
    {    
        const contratos = await pool.query("SELECT id, tipo_contrato FROM tipo_contrato WHERE estado = 'ACTIVO' ORDER BY tipo_contrato;");
        if (contratos[0] != undefined) 
        {
            res.json({success: true, data: contratos});
        }
        else
        {
            res.json({success: false, info: "No hay registros"});
        }                
    }   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error');
    } 
};

/*----------  Función Cargar Tipo de Contrato ----------*/


/*----------  Función Cargar Tipo de Jornada  ----------*/

export const cargarJornadas = async (req: Request, res: Response) => {

    try
    {    
        const jornadas = await pool.query("SELECT id, tipo_jornada FROM tipo_jornada WHERE estado = 'ACTIVO' ORDER BY tipo_jornada");
        if (jornadas[0] != undefined) 
        {
            res.json({success: true, data: jornadas});
        }
        else
        {
            res.json({success: false, info: "No hay registros"});
        }                
    }   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error');
    } 
};

/*----------  Función Cargar Tipo de Jornada ----------*/



/*----------  Función Ingresar Estudios  ----------*/

export const insercionEstudios = async (req: Request, res: Response) => {

    try 
    { 
        var idusuario               = req.body.idusuario;
        var idnivel_formativo       = req.body.idnivel_formativo;
        var idarea_estudio          = req.body.idarea_estudio;
        var idinstitucion           = req.body.idinstitucion;
        var titulo                  = req.body.titulo;
        var fecha_inicio            = req.body.fecha_inicio;
        var fecha_fin               = req.body.fecha_fin;
        var fecha_registro          = dateinit;
        var hora_registro           = horainit;
         
        const estudios = await pool.query("CALL sp_AdicionarEstudios(?,?,?,?,?,?,?,?,?);",[idusuario, idnivel_formativo, idarea_estudio, idinstitucion, titulo, fecha_inicio, fecha_fin, fecha_registro, hora_registro]);
            
        if (estudios)  
        {
            res.json({success: true, info : "Registro Correcto" });
            await pool.query("UPDATE usuarios SET estado_postulacion = 3 WHERE id = ? ", [idusuario]);
        }                
    }   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error !!!');
    } 
}; 

/*----------  Función Ingresar Estudios ----------*/


/*----------  Función Ingresar Experiencia Laboral  ----------*/

export const insercionExperienciaLaboral = async (req: Request, res: Response) => {

    try
    { 
        var idusuario               = req.body.idusuario;
        var empresa                 = req.body.empresa;
        var cargo                   = req.body.cargo;
        var fecha_desde             = req.body.fecha_desde;
        var fecha_hasta             = req.body.fecha_hasta;

        var fecha_registro = dateinit;
        var hora_registro = horainit;

        const explaboral = await pool.query("CALL sp_AdicionarExpLaboral(?,?,?,?,?,?,?);",[idusuario, empresa, cargo, fecha_desde, fecha_hasta, fecha_registro, hora_registro]);
        
        if (explaboral)  
        {
            res.json({success: true, info: "Registro Correcto!"});
            await pool.query("UPDATE usuarios SET estado_postulacion = 13 WHERE id = ? ", [idusuario]);
        }                
	}   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error !!!');
    } 
}; 

/*----------  Función Ingresar Experiencia Laboral ----------*/



/*----------  Función Ingresar Referencias Familiares ----------*/

export const insercionReferenciaFamiliar = async (req: Request, res: Response) => {

    try
    { 
        var idusuario    = req.body.idusuario;
        var parentesco   = req.body.idpar;
        var movil        = req.body.movil;

        var fecha_registro = dateinit;
        var hora_registro = horainit;
        
        const reflaboral = await pool.query("CALL sp_AdicionarReferenciaFamiliar(?,?,?,?,?);",[idusuario, parentesco, movil, fecha_registro, hora_registro]);
            
        if (reflaboral)  
        {
            res.json({success: true, info :"Registro Correcto"});
            await pool.query("UPDATE usuarios SET estado_postulacion = 5 WHERE id = ? ", [idusuario]);
        }                
    }   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error !!!');
    } 
}; 

/*----------  Función Ingresar Referencias Familiares ----------*/


/*----------  Función Menu  ----------*/

export const menu = async (req: Request, res: Response) => {

    try
    {    
        const menu = await pool.query("SELECT * FROM menu a left JOIN menu_padre b ON a.idmenupadre=b.id;");
        if (menu) 
        {
            res.json({menu});
        }                
    }   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error');
    } 
};

/*----------  Función Menu ----------*/



/*----------  Función Cargar Cargos Empresas  ----------*/

export const cargarCargosEmpresas = async (req: Request, res: Response) => {

    try
    { 
        var idempresa = req.body.idempresa;  
        const cargos = await pool.query("SELECT id, cargo FROM cargos_empresas WHERE idempresa = ? AND estado = 'ACTIVO' ORDER BY cargo", idempresa);
        if (cargos) 
        {
            res.json({success: true, data: cargos});
        }                
    }   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error');
    } 
};

/*----------  Función Cargar Cargos Empresas  ----------*/



/*----------  Función Cargar Ofertas Estado Cero ----------*/

export const cargarOfertasEstadoCero = async (req: Request, res: Response) => {

    try
    { 

        var idempresa = req.body.idempresa;  
        const ofertas = await pool.query("CALL sp_loadOffers_0(?);", idempresa);
        if (ofertas[0][0] != undefined) 
        {
            res.json({success: true, data: ofertas[0]});
        }  
        else
        {
            res.json({success: false, info: "No hay datos registrados"});
        }              
    }   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error');
    } 
};

/*----------  Función Cargar Ofertas Estado Cero   ----------*/


/*----------  Función Actualizar Oferta  ----------*/

export const actualizarOferta = async (req: Request, res: Response) => {

    try
    { 
        var idoferta        = req.body.idoferta; 
        var idusuario_sis   = req.body.idusuario_sis;  
        const update = await pool.query("CALL sp_UpdateOffer(?,?)",idoferta, idusuario_sis );
        console.log(req.body);
        if (update) 
        {
            res.json({success: true, info: "Actualización correcta"});
        }                
    }   
    catch (error) 
    {
        console.log(error);
        return res.status(500).json('Internal Server error');
    } 
};

/*----------  Función Actualizar Oferta  ----------*/




/*==============================================
=            Autenticación Passport            =
==============================================*/

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req: any, username: any, password: any, done: any) => {
        const rows = await pool.query('SELECT * FROM usuarios WHERE email = ?', [username]);
        const user = rows[0];
        var password = md5(req.body.password);
        if (rows.length > 0) 
	  	{
            if (password === rows[0].password) 
            {
                const rowssession = await pool.query('CALL sp_MaxIdSession()');
                var maxses = rowssession[0][0].maximo+1;
                var dataok = [maxses,rows[0].id, ipv4, dateinit, horainit, dateinit, horainit, "EXITOSA"];
                const sessionOK = await pool.query("CALL sp_insertLogSession(?,?,?,?,?,?,?,?)", dataok);
                done(null, user); 
                console.log(req.session.passport.user);
            }
            else
            {
                console.log("Password Inválido");
                const rowssession = await pool.query('CALL sp_MaxIdSession()');
                var maxses = rowssession[0][0].maximo+1;
                var data = [maxses, rows[0].id, ipv4, dateinit, horainit, dateinit, horainit, 'SI'];
                const insertsessionFailed = await pool.query("CALL sp_insertLogSesionFallida(?,?,?,?,?,?,?,?)", data)
            }                       
        }
        else
        {
            done(null, false);console.log("email no registrado");
        }
            
  }));




passport.use('local.register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req: any, username: any, password: any, done: any) => {
     const { pnombre, papellido, movil, idarea } = req.body;
     const lastid    = await pool.query("CALL sp_MaxUsuario()");
     const maxIdUsu    = lastid[0][0].maxId;
        let newUser = {
          pnombre,
          papellido,
          movil,
          username,
          password,
          idarea,
          id: maxIdUsu
        };
            newUser.password = md5(password);
            // Saving in the Database
    
            const validar = await pool.query('SELECT email FROM usuarios WHERE email = ? AND estado = "ACTIVO" ', [username]);
          
            if(validar[0] != undefined)
            {
               console.log("Usuario registrado");
                done(null,false);
            }
            else
            {

                
  
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
                    
                    newUser.id =maxIdUsu;
                    console.log(newUser);
                    return 	done(null, newUser);
            }
}));


passport.serializeUser((user: { id: any; }, done: any) => {
    done(null, user.id);
});
  
  
passport.deserializeUser(async (id: any,done: any) => {
    const query = await pool.query('SELECT id, email FROM usuarios WHERE id = ?', [id]);
    done(null, query);
    console.log(query);
});

/*=====  End of Autenticación Passport  ======*/

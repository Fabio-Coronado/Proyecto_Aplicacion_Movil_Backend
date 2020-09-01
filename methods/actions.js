var User = require('../models/user')
var Suggest = require('../models/suggests')
var jwt = require('jwt-simple')
var path = require('path');
var config = require('../config/dbconfig')
const { authenticate } = require('passport')
const { updateOne } = require('../models/user')
const e = require('express')



var functions = {
    addNew: function (req, res) {
        if((!req.body.username) || !(req.body.password)){
            res.json = ({success: false, msg: 'Campos incompletos'})
        }
        else{
            var newUser = User({
                username : req.body.username,
                password : req.body.password,
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                performance:{
                    1:20.0,
                    2:20.0,
                    3:20.0,
                    4:20.0,
                    5:20.0,
                }
            });
            User.findOne({
                username: req.body.username
            }, function(err, user){
                if (user == undefined){
                    newUser.save(function (err, newUser) {
                        if(err){
                            res.status(403).json({success: false, msg: 'El usuario no pudo ser guardado'})
                        }
                        else{
                            var token = jwt.encode(newUser, config.secret)
                            res.json({success: true, msg: 'Usuario creado', token: token})
                        }
                                    
                    })

                } else{
                    res.status(403).json({success: false, msg: 'El nombre de usuario esta en uso'})
                }       
            }
            )
            
        }
        
    },

    authenticate: function (req, res){
        User.findOne({
            username: req.body.username
        }, function(err, user) {
            
            if (err) throw err
            if (!user) {
                res.status(403).send({success: false, msg: 'Usuario no encontrado'})
            }

            else{
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if(isMatch && !err){
                        var token = jwt.encode(user, config.secret)
                        res.json({success: true, token: token})
                    }
                    else{
                        return res.status(403).json({success: false, msg: 'Contraseña incorrecta'})
                    }
                })
            }
        })
    },

    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            var username = decodedtoken.username
            User.findOne({
                username: username
            }, function(err,obj) {
                return res.json(obj)
            });

        }
        else{
            return res.json({success:false, msg: 'No headers'})
        }
    },

    changeName: function(req, res){
        if(req.body.username){
            User.findOne({
                username: req.body.username
            }, function(err, user) {
                if (req.body.firstname && req.body.lastname){
                    
                    user.firstname = req.body.firstname
                    user.lastname = req.body.lastname
                    user.save(function (err) {
                        if (err)
                        {
                            res.json({success: false, msg: 'Los datos no pudieron ser cambiados'})
                        }
                        res.json({success: true, msg: 'Datos cambiados'})
                    });

                } else{
                    res.json({success: false, msg: 'Ingrese los datos'})
                }
                                       
            })

        }else{
            return res.status(403).json({success:false, msg: 'Usuario no encontrado'})
        }

    },

    changePassword: function(req, res){
        if(req.body.username){
            User.findOne({
                username: req.body.username
            }, function(err, user) {
                if (!err && user){
                        if(req.body.oldpassword && req.body.newpassword){
                        user.comparePassword(req.body.oldpassword, function (err, isMatch) {
                            if(isMatch && !err){
                                user.password = req.body.newpassword
                                user.save(function (err) {
                                    if (err)
                                    {
                                        res.json({success: false, msg: 'La contraseña no pudo ser cambiada'})
                                    }
                                    res.json({success: true, msg: 'Contraseña cambiada'})
                                });
                            }
                            else{
                                return res.status(403).json({success: false, msg: 'Contraseña incorrecta'})
                            }
                        })
                } else{

                return res.json({success: false, msg: 'Ingrese los campos'})
            }
            }
            
            });

        }
        else{
            return res.json({success:false, msg: 'Usuario no encontrado'})
        }

    },

    editPerformace: function(req, res){

        if(req.body.username && req.body.number && req.body.categoria){              
            const filter = { username: req.body.username }

            User.findOne(filter, function( err, user){

                if(user != undefined){
                    user.performance.set(`${req.body.categoria}`, req.body.number)
                    user.save(function (err) {
                        if (err)
                        {
                            res.json({success: false, msg: 'Los datos no pudieron ser cambiados'})
                        }
                        res.json({success: true, msg: 'Datos guardados'})
                    });
                   
                }
                else{
                    res.json({success: false, msg: 'Usuario no encontrado'})
                }
            

            });
    }
    
    
    },
    addSuggest: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            var username = decodedtoken.username

                if((!req.body.pregunta) || !(req.body.categoria) || !(req.body.alternativa1) ||
                 !(req.body.alternativa2) || !(req.body.alternativa3) || (!req.body.alternativa4) ){
                    return res.json = ({success: false, msg: 'Campos incompletos'})
                } else{
                    var newSuggest = Suggest({
                        username : username,
                        categoria : req.body.categoria,
                        pregunta: req.body.pregunta,
                        alternativa1: req.body.alternativa1,
                        alternativa2: req.body.alternativa2,
                        alternativa3: req.body.alternativa3,
                        alternativa4: req.body.alternativa4,

          
                });
                newSuggest.save(function (err, newSuggest) {
                    if(err){
                        return res.status(403).json({success: false, msg: 'No se pudo enviar la pregunta'})
                    }
                    else{
                        return res.json({success: true, msg: 'Pregunta enviada'})
                    }
                                
                })
            

        }

    } else{
        return res.status(403).json({success: false, msg: 'No headers'})
    }
},
    curiosidad: function(req, res){
        res.sendFile(path.join(__dirname, '../data', '/curiosidad.html'))
        
    },
    noticias: function(req, res){
        res.sendFile(path.join(__dirname, '../data', '/noticias.html'))
        
    }
    
}

module.exports = functions
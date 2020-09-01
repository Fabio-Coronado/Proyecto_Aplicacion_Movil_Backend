var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var suggestSchema = new Schema({
    username : {
        type: String,
        require: true
    },
    categoria : {
        type : String,
        require: true
    },
    pregunta:{
        type : String,
        require: true
    },
    alternativa1:{
        type : String,
        require: true
    },
    alternativa2:{
        type : String,
        require: true
    },
    alternativa3:{
        type : String,
        require: true
    },
    alternativa4:{
        type : String,
        require: true
    }
})





module.exports = mongoose.model('Suggest', suggestSchema)
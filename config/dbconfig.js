require('dotenv').config()
module.exports = {
    secret : `${process.env.KEY_SECRET}`,
    database : `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g7tla.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`

}
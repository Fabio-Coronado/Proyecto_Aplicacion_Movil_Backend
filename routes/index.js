const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()

router.get('/', (req, res) =>{
    res.send('Hello World')
})

router.get('/dashboard', (req, res) =>{
    res.send('Dashboard')
})

router.post('/adduser', actions.addNew)
router.post('/authenticate', actions.authenticate)
router.get('/getinfo', actions.getinfo)
router.post('/changename', actions.changeName)
router.post('/changepassword', actions.changePassword)
router.post('/editperformance', actions.editPerformace)
router.post('/addsuggest', actions.addSuggest)
router.get('/curiosidad', actions.curiosidad)
router.get('/noticias', actions.noticias)

module.exports = router
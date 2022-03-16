/// IMPORTS ///
const express = require('express')
const axios = require('axios').default
const https = require('https')
const multer = require('multer')
const api2_controller = require('../controllers/api2Controller')



/// INITIALIZATION ///
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
axios.defaults.httpsAgent = https.Agent({rejectUnauthorized: false}) //otherwise data.tc.gc.ca/ returns a cert issue (https://github.com/axios/axios/issues/535)

/// ROUTES ///
//GET all
router.get('/', api2_controller.get_recalls)

//Get one
router.get('/recall', api2_controller.get_single)

//POST
router.post('/', upload.single('file'), api2_controller.post_new)

/// EXPORT ///
module.exports = router
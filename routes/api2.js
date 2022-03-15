/// IMPORTS ///
//import { LowSync, JSONFileSync } from 'lowdb' //const { LowSync, JSONFileSync } = await import('lowdb')
const express = require('express')
const {JSONPath} = require('jsonpath-plus');
const axios = require('axios').default;
const https = require('https')
const jsonfile = require('jsonfile')

/// SET UP ///
// constants
const router = express.Router()
const jsonFileInput = './files/api2input.json' //using simple jsonFile as DB because the whole data set fits in memory and we prevent a network error
const jsonFileOutput = './files/api2output.json'

// initializations
axios.defaults.httpsAgent = https.Agent({rejectUnauthorized: false}) //otherwise the data.tc.gc.ca/ returns a cert issue (https://github.com/axios/axios/issues/535)


//TransCan API path
//Direct connection, no user-key but cert issues
//const apiUrlOrigin = 'https://data.tc.gc.ca/';				
//const apiUrlBase = 'v1.3/api/eng/vehicle-recall-database/';

//Through open canada, v1 instead of v1.3, user-key required, no cert issue
const apiUrlOrigin = 'https://vrdb-tc-apicast-production.api.canada.ca'
const apiUrlBase = 'eng/vehicle-recall-database/v1/'
//const options = {headers: requestHeader}; //get user-key from .env
//TODO put this somewhere
//let url = new URL(apiUrlBase, apiUrlOrigin);
//url.pathName = path.join(apiUrlBase, 'recall/make-name/Ford');

/// ROUTES ///
//GET all
router.get('/all', (req, res) => {
  console.log('GET all')
  jsonfile.readFile(jsonFileOutput)
    .then(obj => res.json(obj))
    .catch(error => console.error(error))
})

//POST
router.post('/all', (req, res) => {
  console.log('POST file')
  
  //TODO launch data append
  
  jsonfile.writeFile(jsonFileInput, req.body)
    .then(result => {
      console.log(`file received ${result}`)
      res.json({ 'file received': true})
    })
    .catch(error => console.error(error))
})

//GET category
router.get('/category/:category', (req, res) => {
  console.log(`search category ${ req.params.category }`)
  jsonfile.readFile(jsonFileOutput)
    .then(obj => {
      let filtered = obj
      
      //let jsonPath = '$.[*].recallNumber'
      //'$..book.*[?(@property === "category" && @.match(/TION$/i))]'
  
      //TODO loop through to match CATEGORY_ETXT or CATEGORY_FTXT
      
      res.json(filtered)
    })
    .catch(error => console.error(error))
})

// TODO delete this when testing completed
router.get('/test', (req, res) => {
//httpsRequest('get', 'https://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/2015321')
  //httpsRequest('get', 'https://vrdb-tc-apicast-production.api.canada.ca/eng/vehicle-recall-database/v1/recall-summary/recall-number/2015321', options)

  console.log(`new request `)
  axios.get('https://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/2015322')
  .then(response => {
    // response object has 3 variables: statusCode, headers and body. We usually only want to show the body
    //console.log(response.data)
    res.json(response.data)
  }).catch(error => {
    console.error(error.message)
    console.error(error.stack)
    res.send(error)
  })
})

function findCategory(){
  //TODO (put in controller... or model but that might be overkill)
}

/// EXPORT ///
module.exports = router
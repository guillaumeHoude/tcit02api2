//ESM instead of CommonJS because of lowdb
import express from 'express'
import { LowSync, JSONFileSync } from 'lowdb' //const { LowSync, JSONFileSync } = await import('lowdb')
//import {httpRequest, httpsRequest} from './api-helper.js'
import {JSONPath} from 'jsonpath-plus'
import axios from 'axios'
import https from 'https'

axios.defaults.httpsAgent = https.Agent({rejectUnauthorized: false}) //otherwise the data.tc.gc.ca/ returns a cert issue (https://github.com/axios/axios/issues/535)

/// set up ///
const app = express()
const port = 3002
const db = new LowSync(new JSONFileSync('./files/api2db.json'))
const requestHeader = {'Accept': 'application/json','user-key': '7527646b6f624c68a6fe61c2496033e3'}

//TransCan API path
//Direct connection, no user-key but cert issues
//const apiUrlOrigin = 'https://data.tc.gc.ca/';				
//const apiUrlBase = 'v1.3/api/eng/vehicle-recall-database/';

//Through open canada, v1 instead of v1.3, user-key required, no cert issue
const apiUrlOrigin = 'https://vrdb-tc-apicast-production.api.canada.ca'
const apiUrlBase = 'eng/vehicle-recall-database/v1/'
const options = {headers: requestHeader};

//TODO put this somewhere
//let url = new URL(apiUrlBase, apiUrlOrigin);
//url.pathName = path.join(apiUrlBase, 'recall/make-name/Ford');


app.listen(port, () => console.log(`App listening on port ${port}!`))

/// REST API2 ///
app.get('/', (req, res) => {
  res.send(
  `Welcome to Make REST API Calls In Express!\n
  ${req.path}`
  )
})

app.get('/all', (req, res) => {
  db.read()
  res.json(db.data)
})

app.get('/category/:category', (req, res) => {
  db.read()
  let filtered = db.data
  //let jsonPath = '$.[*].recallNumber'
  //'$..book.*[?(@property === "category" && @.match(/TION$/i))]'
  
  //TODO loop through to match CATEGORY_ETXT or CATEGORY_FTXT
  
  res.json(filtered)
})


app.get('/getAPIResponse', (req, res) => {
//httpsRequest('get', 'https://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/2015321')
  //httpsRequest('get', 'https://vrdb-tc-apicast-production.api.canada.ca/eng/vehicle-recall-database/v1/recall-summary/recall-number/2015321', options)

  console.log(`new request `)
  axios.get('https://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/2015322', options)
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

app.post('/jsonInput', (req, res) => {
  db.data = req.body
  db.write()
  res.send(req.body) // request body should be json file
})

function findCategory(){
  //TODO 
}

function updateCategories(){
  //TODO
}
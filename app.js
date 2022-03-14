//File converted to ESM
import express from 'express'
import { LowSync, JSONFileSync } from 'lowdb'
import {httpRequest, httpsRequest} from './api-helper.js'

/// set up ///
const app = express()
const port = 3002
const db = new LowSync(new JSONFileSync('./files/api2db.json'))

//TransCan API path
//Direct connection, no user-key but cert issues
//const apiUrlOrigin = 'https://data.tc.gc.ca/';				
//const apiUrlBase = 'v1.3/api/eng/vehicle-recall-database/';

//Through open canada, v1 instead of v1.3, user-key required, no cert issue
const apiUrlOrigin = 'https://vrdb-tc-apicast-production.api.canada.ca'
const apiUrlBase = 'eng/vehicle-recall-database/v1/'
const options = {headers: {'Accept': 'application/json','user-key': '7527646b6f624c68a6fe61c2496033e3'}};

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
  
  //TODO loop through to match CATEGORY_ETXT or CATEGORY_FTXT
  
  res.json(db.data)
})


app.get('/getAPIResponse', (req, res) => {
    
  //httpsRequest('get', 'https://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/2015321')
  httpsRequest('get', 'https://vrdb-tc-apicast-production.api.canada.ca/eng/vehicle-recall-database/v1/recall-summary/recall-number/2015321', options)
  .then(response => {
    // response object has 3 variables: statusCode, headers and body. We usually only want to show the body
        headers: incomingMessage.headers,
        body: []
    res.json(response.body)
  }).catch(error => {
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
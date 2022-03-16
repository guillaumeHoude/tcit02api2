/// IMPORTS ///
const express = require('express')
const axios = require('axios').default
const https = require('https')
const jsonfile = require('jsonfile')
const { Buffer } = require('buffer')
const createError = require('http-errors')

/// CONSTANTS ///
const jsonFileInput = './files/api2input.json' //using simple jsonFile as DB as the whole data set fits in memory and we prevent a network error
const jsonFileOutput = './files/api2output.json'
const usefullVars = {modelName: 'MODEL_NAME_NM', makeName: 'MAKE_NAME_NM', year: 'DATE_YEAR_CD', categoryEn: 'CATEGORY_ETXT', categoryFr: 'CATEGORY_FTXT'}

// initializations
const router = express.Router()
axios.defaults.httpsAgent = https.Agent({rejectUnauthorized: false}) //otherwise the data.tc.gc.ca/ returns a cert issue (https://github.com/axios/axios/issues/535)

/// ROUTES ///
//GET recalls
exports.get_recalls = function (req, res) {
  console.log(`GET recalls ${(req.query.category ? req.query.category : '')}`)
  
  jsonfile.readFile(jsonFileOutput)
    .then(obj => {
      if(req.query.category !== 'undefined' && req.query.category){
        let filtered = obj.filter(recall => {
          return recall.category.CATEGORY_ETXT.toLowerCase() === req.query.category.toLowerCase() || recall.category.CATEGORY_FTXT.toLowerCase() === req.query.category.toLowerCase()          
        })

        res.json(filtered)
      }else{
        res.json(obj)
      }
    })
    .catch(error => console.error(error))
}

//POST
exports.post_new = function (req, res) {
  console.log('POST file')
  let buf = Buffer.from(req.file.buffer, 'ascii')
  let recalls = JSON.parse(buf.toString())
  
  jsonfile.writeFile(jsonFileInput, recalls)
    .then(result => {
      console.log(`file received`)
      res.json({ 'file received': true})
    })
    .catch(error => console.error(error))
 
  Promise.all(recalls.map(recall => {
    return new Promise((resolve, reject) => {
      findCategories(recall)
        .then(newRecall =>{
          resolve(newRecall)
        })
        .catch(error => {
          console.error(error)
          console.log('oldRecall')
          reject(recall)
        })
    })
  })) //Promise.all complete, then
    .then(values => {
      jsonfile.writeFile(jsonFileOutput, values)
        .then(result => {
          console.log(`file written`)
        })
        .catch(error => console.error(error))
  })
}

/// UTILITIES ///
const findCategories = (recallObj) => {
  return new Promise((resolve, reject) => {
    //initialization
    let categories = {CATEGORY_ETXT: '', CATEGORY_FTXT: ''}
    
    getSummary(recallObj.recallNumber)
      .then(obj => {
        // filter result set to keep matching entries
        // Things to compare
        // model name: MODEL_NAME_NM / modelName
        // make name: MAKE_NAME_NM / makeName
        // year: DATE_YEAR_CD / recallYear
        let matching = obj.ResultSet.filter(recall => {
          let warning = recall.map(varObj => {
            switch (varObj.Name) {
              case usefullVars.modelName:
                //console.log(`${varObj.Value.Literal} vs ${recallObj.modelName}`)
                return varObj.Value.Literal == recallObj.modelName
              case usefullVars.makeName:
                //console.log(`${varObj.Value.Literal} vs ${recallObj.makeName}`)
                return varObj.Value.Literal == recallObj.makeName
              case usefullVars.year:
                //console.log(`${varObj.Value.Literal} vs ${recallObj.recallYear}`)
                return varObj.Value.Literal == recallObj.recallYear
              default:
                //console.log('default')
                return true
            }
          })
          return warning.every(Boolean) //if everything matches, keep the entry
        })
        
        //console.log(`# of matching entry ${matching.length} / ${obj.ResultSet.length}`)
        if(matching.length < 1){
          //console.log(JSON.stringify(matching))
          console.warn(`${recallObj.recallNumber} - No exact match found, will add empty field`)
        }else{
          if(matching.length > 1){
            console.warn(`${recallObj.recallNumber} - Multiple matches, taking first one`)
          }
          
          categories.CATEGORY_ETXT = matching[0].find(varObj => {
            return varObj.Name == usefullVars.categoryEn
          }).Value.Literal
          categories.CATEGORY_FTXT = matching[0].find(varObj => {
            return varObj.Name == usefullVars.categoryFr
          }).Value.Literal
        }

        recallObj.category = categories // will add empty categories, which is fine
        resolve(recallObj)
      })
      .catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

const getSummary = (recallNumber) => {
  return new Promise((resolve, reject) => {
    if (typeof recallNumber == 'undefined'){
      reject(createError(400, '400 - Bad Request: No recall number provided'))
    }
    
    axios.get('https://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/'+recallNumber)
      .then(response => {
        resolve(response.data)
      }).catch(error => {
        console.error(error.message)
        console.error(error.stack)
        reject(error)
      })
  })
}
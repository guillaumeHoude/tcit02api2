import http from 'node:http' //load http module https://nodejs.org/docs/latest-v16.x/api/http.html
import https from 'node:https'


export function httpRequest (method, url, bonusOptions, body) {
  method = method.toUpperCase()
  if (!['GET', 'POST', 'HEAD'].includes(method)) {
    throw new Error(`Invalid method: ${method}`)
  }

  let urlObject;

  try {
    urlObject = new URL(url);
  } catch (error) {
    throw new Error(`Invalid url ${url}`)
  }

  if (body && method !== 'POST') {
    throw new Error(`Invalid use of the body parameter while using the ${method.toUpperCase()} method.`)
  }

  let options = {
    method: method,
    hostname: urlObject.hostname,
    port: urlObject.port,
    path: urlObject.pathname
  }

  if(bonusOptions){
    options = Object.assign({}, options, bonusOptions)
  }
  
  if (body) {
    options.headers = {'Content-Length':Buffer.byteLength(body)}
  }

  return new Promise((resolve, reject) => {
    const clientRequest = http.request(options, incomingMessage => {
      // Response object.
      let response = {
        statusCode: incomingMessage.statusCode,
        headers: incomingMessage.headers,
        body: []
      }

      // Collect response body data.
      incomingMessage.on('data', chunk => {
        response.body.push(chunk)
      });

      // Resolve on end.
      incomingMessage.on('end', () => {
        if (response.body.length > 0) {
          response.body = response.body.join()

          try {
            response.body = JSON.parse(response.body)
          } catch (error) {
            // Silently fail if response is not JSON.
          }
        }

        resolve(response)
      })
    })

    // Reject on request error.
    clientRequest.on('error', error => {
      reject(error)
    });

    // Write request body if present.
    if (body) {
      clientRequest.write(body)
    }

    // Close HTTP connection.
    clientRequest.end()
  })
}

export function httpsRequest (method, url, bonusOptions, body) {
  method = method.toUpperCase()
  if (!['GET', 'POST', 'HEAD'].includes(method)) {
    throw new Error(`Invalid method: ${method}`)
  }

  let urlObject;

  try {
    urlObject = new URL(url);
  } catch (error) {
    throw new Error(`Invalid url ${url}`)
  }

  if (body && method !== 'POST') {
    throw new Error(`Invalid use of the body parameter while using the ${method.toUpperCase()} method.`)
  }

  let options = {
    method: method,
    hostname: urlObject.hostname,
    port: urlObject.port,
    path: urlObject.pathname
  }

  if(bonusOptions){
    options = Object.assign({}, options, bonusOptions)
  }
  
  if (body) {
    options.headers = {
        //'Content-Type': 'application/json',
        'Content-Length':Buffer.byteLength(body)
      }
  }

  return new Promise((resolve, reject) => {
    const clientRequest = https.request(options, incomingMessage => {
      // Response object.
      let response = {
        statusCode: incomingMessage.statusCode,
        headers: incomingMessage.headers,
        body: []
      }

      // Collect response body data.
      incomingMessage.on('data', chunk => {
        response.body.push(chunk)
      });

      // Resolve on end.
      incomingMessage.on('end', () => {
        if (response.body.length > 0) {
          response.body = response.body.join()

          try {
            response.body = JSON.parse(response.body)
          } catch (error) {
            // Silently fail if response is not JSON.
          }
        }

        resolve(response)
      })
    })

    // Reject on request error.
    clientRequest.on('error', error => {
      reject(error)
    });

    // Write request body if present.
    if (body) {
      clientRequest.write(body)
    }

    // Close HTTP connection.
    clientRequest.end()
  })
}
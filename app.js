const express = require('express')
const createError = require('http-errors')
const api2Router = require('./routes/api2')

/// set up ///
const app = express()
const port = 3002


app.listen(port, () => console.log(`App listening on port ${port}!`))

/// REST API2 ///
app.use('/api2', api2Router)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, '404 - page not found'))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send(err)
})

module.exports = app
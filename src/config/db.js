const {Pool} = require('pg')

module.exports = new Pool({
  database: 'LauchStore',
  server: 'localhost',
  user:"postgres",
  password:"1234$",
  port:5432
})


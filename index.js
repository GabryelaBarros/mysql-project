const Hapi = require('@hapi/hapi')
const fetch = require('node-fetch')
const mysql = require('mysql')
 
 
const init = async () => {
 
   const server = Hapi.server({
       port: 3000,
       host: 'localhost'
   })
 
   server.route({
       method: 'GET',
       path: '/accenture/{id?}',
       handler: async (request, h) => {
           const userId = request.params.id ? request.params.id : 'não deu certo'
           const person = await getPerson(userId)
 
           const connection = mysql.createConnection({
               host: 'localhost',
               user: 'root',
               password: 'root',
               database: 'exercise01'
           })
 
 
           const queryPromise = new Promise((resolve) => {
 
               connection.connect(err => {
                   if (err) throw err
 
                   const sqlInsert = `INSERT INTO people` +
                       `(person_id, person_name, height, hair_color)` +
                       ` VALUES (${userId},"${person.name}",${person.height},"${person.hair_color}")`
 
                   connection.query(sqlInsert, (err, result) => {
 
                       if (err) throw err
 
                       const sqlSelect = `SELECT person_name, height, hair_color FROM people WHERE id = ${result.insertId}`
 
                       connection.query(sqlSelect, (err, result) => {
                           if (err) throw err

                           console.log(result)
                           connection.end()
 
                           resolve(result)
 
                       })
 
                   })
 
               })
 
 
           })
 
           return queryPromise.then(result => result)
       }
   })
 
   await server.start()
 
}
 
const getPerson = id =>
   fetch(`https://swapi.dev/api/people/${id}`)
       .then(response => response.json())
       .then(person => person)
       .catch(err => console.log(err))
 
init()
 
 


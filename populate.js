const { connect } = require('./database.js')
const db = connect()

const HAMSTERS = 'hamsters'

const data = require('./src/data.json')
console.log(data)

populate()

async function populate(){
    data.forEach(object =>{
        db.collection(HAMSTERS).add(object)
    })
}
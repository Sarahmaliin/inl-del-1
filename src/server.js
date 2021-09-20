const express = require('express')
const app = express()
const PORT = 5555;
const hamsterRouter = require('./routes/hamsters.js')


app.use( express.urlencoded({ extended: true }) )
app.use( express.json() )
app.use((req, res, next) => {
	console.log(`${req.method}  ${req.url}`, req.body);
	next()
})

app.use(express.static(__dirname + '/public'))

//routes/endpoints

app.use('/hamsters', hamsterRouter)

app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`)
})
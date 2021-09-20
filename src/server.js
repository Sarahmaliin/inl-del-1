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

app.get('/index', (req, res) =>{
	console.log(hamsterRouter)
	res.sendFile(__dirname + '/public/index.html')
})

app.get('/style', (req, res) =>{
	res.sendFile(__dirname + '/public/style.css')
})

app.get('/indexjs', (req, res) =>{
	res.sendFile(__dirname + '/public/index.js')
})

app.get('/img/:id', (req, res) =>{
	res.sendFile(__dirname + '/public/img')
})

//routes/endpoints

app.use('/hamsters', hamsterRouter)

app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`)
})
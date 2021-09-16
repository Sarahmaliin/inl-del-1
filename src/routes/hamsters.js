const express = require('express')
const router = express.Router()

const database = require('../database.js')
const connect = database.connect
const db = connect()
const HAMSTERS = 'hamsters'

console.log(db.collection(HAMSTERS).get())

router.get('/', async (req, res) =>{ //array
    let array = await getHamsters()
    res.send(array)
})

router.get('/random', async (req, res) =>{ //GET random
    let randomArray = await getHamsters()
    console.log(randomArray.length)

    let index = Math.floor(Math.random() * randomArray.length)
    let randomHamster = randomArray[index]

    console.log(randomHamster)
    res.send(randomHamster)
})

router.get('/:id', async (req, res)=>{ //Id
    const idUser = await getOneHamster(req.params.id) //får tillbaka id från funktionen
    if(!idUser){
        res.status(404).send('wrong id')
        return
    }
    res.send(idUser)    
})


 router.put('/:id', async (req, res) =>{ //PUT - OBS! ÄNDRAR MEN MÅSTE KORRIGERA STATUSKODEN
     const updateArray = await HamsterObject(req.params.id)
     if(!updateArray){
         res.status(400)
     }
     res.status(200).send(updateArray)
})

router.delete('/:id', async (req, res) =>{
let deleted = await deleteOne(req.params.id)
if(!deleted){
    res.status(400)
}
res.send(deleted)
})



//functions

async function HamsterObject(id){
    console.log('updating one document')
    const docId = id

    console.log(docId)
    
     const UpdateData = {
        age: 3
     }
     const settings = { merge: true}
     await db.collection(HAMSTERS).doc(docId).set(UpdateData, settings)
 }

async function getHamsters(){
    const userRef = db.collection(HAMSTERS)
    const userSnapshot = await userRef.get()

    if(userSnapshot.empty) {
        return []
    }

    const array = []
    await userSnapshot.forEach(async docRef =>{
        const data = await docRef.data()
        data.id = docRef.id
        array.push(data)
    })
    return array
}


async function getOneHamster(id) {
    const docRef = db.collection(HAMSTERS).doc(id) // hämta databasobjektet med id från parameter
    const docSnapshot = await docRef.get() //
    if( docSnapshot.exists ) {
        return await docSnapshot.data()
    }else{
        console.log('nothing to see')
        return null
    }
}

async function deleteOne(id) {
    console.log('Deleting a document...');
    const docId = id

	const docRef = db.collection(HAMSTERS).doc(docId)
	const docSnapshot = await docRef.get()
	console.log('Document exists? ', docSnapshot.exists);
	const result = await docRef.delete()
}

 async function updateHamster(id, object){
     const docRef = db.collection(HAMSTERS).doc(id)
     docRef.set(object)
}



module.exports = router
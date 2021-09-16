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

router.get('/cutest', async (req, res) =>{
    let cutestArray = await getCutest()
    res.send(cutestArray)
})

router.get('/:id', async (req, res)=>{ //Id
    const idUser = await getOneHamster(req.params.id) //får tillbaka id från funktionen
    if(!idUser){
        res.sendStatus(404)
        return
    }
    res.sendStatus(200)    
})


 router.put('/:id', async (req, res) =>{ 
     const updateArray = await HamsterObject(req.params.id)
     if(!updateArray){
         console.log('inside 400 code')
         res.sendStatus(400)
     } else{
        console.log('inside 200 code')
        res.sendStatus(200)
        return
     }
     
})

router.delete('/:id', async (req, res) =>{ //deletear men får statuskod 400 ändå
    let deleted = await deleteOne(req.params.id)
    if(!deleted ){
        res.sendStatus(400)
    }
    res.send()
    return
})



//functions

async function HamsterObject(id){ 
    console.log('updating one document')
    
     const UpdateData = {
        wins: 3
     }

    const docRef = db.collection(HAMSTERS).doc(id) // hämta databasobjektet med id från parameter
    const docSnapshot = await docRef.get() //
    if( docSnapshot.exists ) {
        const settings = { merge: true}
        return await db.collection(HAMSTERS).doc(id).set(UpdateData, settings)
    }else{
        console.log('nothing to see')
        return null
    }

     
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
    const docRef = db.collection(HAMSTERS).doc(id) 
    const docSnapshot = await docRef.get() //
    if( docSnapshot.exists ) {
        return await docSnapshot.data()
    }else{
        console.log('nothing to see')
        return null
    }
}

async function deleteOne(id) { //får error, vrf??

	const docRef = db.collection(HAMSTERS).doc(id)
	const docSnapshot = await docRef.get()
    if(docSnapshot.exists){
        console.log('Document exists? ', docSnapshot.exists);
	    await docRef.delete()
        return 
    }
    return null
	
}

async function getCutest() {
    const array = await getHamsters()

    if(array.empty){
        return []
    }
        let cutest = [];
        for (let i = 0; i < array.length; i++){ //loopa igenom array, ta ut obj till min array
        cutest[i] = array[i].wins; //returns all objects w array[i], .wins returns number of wins
    }
    
    let finalResult = Math.max(...cutest) // får ut högsta talet här på wins.
    console.log(finalResult)

    //Leta sen upp vilken obj i array som matchar med resultatet på wins??
     return 
}

module.exports = router
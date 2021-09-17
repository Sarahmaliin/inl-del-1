const express = require('express')
const router = express.Router()

const database = require('../database.js')
const connect = database.connect
const db = connect()
const HAMSTERS = 'hamsters'

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


 router.put('/:id', async (req, res) =>{ //ok med statuscode, korrigeras?
     const updateArray = await HamsterObject(req.params.id)
     if(!updateArray){
         res.sendStatus(404)
     } else{
        res.sendStatus(200)
        return
     }
     
})

router.delete('/:id', async (req, res) =>{ //deletear men får statuskod 400 ändå
    let deleted = await deleteOne(req.params.id)
    if(!deleted ){
        console.log('inside 404 code')
        res.sendStatus(404)
        return
    }else{
        console.log('inside 200 code')
        res.sendStatus(200)
    }    
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

async function deleteOne(id) { //funkar!

	const docRef = db.collection(HAMSTERS).doc(id)
	const docSnapshot = await docRef.get()
    if(docSnapshot.exists){
        console.log('Document exists? ', docSnapshot.exists);
	    return await docRef.delete()
    }else{
        return null
    }
    
	
}

async function getCutest() {
    const array = await getHamsters()

    if(array.empty){
        return []
    }
        let cutest = [];
        for (let i = 0; i < array.length; i++){ //loopa igenom array, ta ut obj till min array
        cutest[i] = array[i].wins; //returnera värde på wins i alla obj

    }
        let finalResult = Math.max(...cutest) // får ut högsta talet här på wins.
        let wins = array.find(({wins}) => wins === finalResult) //hittar värde i wins i array som har samma värde som högst resultat
        
        if(wins){
                console.log(wins)
                return wins
            }else{
                console.log('can not find it')
                return null
                
            }
}

module.exports = router, getHamsters
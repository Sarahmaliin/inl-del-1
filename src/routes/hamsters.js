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

router.get('/random', async (req, res) =>{
    let randomArray = await getHamsters()
    let index = Math.floor(Math.random() * randomArray.length)
    let randomHamster = randomArray[index]

    res.send(randomHamster)
})

router.get('/cutest', async (req, res) =>{
    let cutestArray = await getCutest()
    res.send(cutestArray)
})

router.get('/:id', async (req, res)=>{ //Id
    const idHam = await getOneHamster(req.params.id) //får tillbaka id från funktionen
    if(!idHam){
        res.sendStatus(404)
        return
    }
    res.sendStatus(200)    
})

 router.put('/:id', async (req, res) =>{ 
     let item = req.body
     const updateArray = await HamsterObject(req.params.id,item)

     if(!updateArray){
         res.sendStatus(404)
     } else{
        res.sendStatus(200)
        return
     }
     
})

router.delete('/:id', async (req, res) =>{ 
    let deleted = await deleteOne(req.params.id)
    if(!deleted ){
        res.sendStatus(404)
        return
    }else{
        res.sendStatus(200)
    }    
})

function checkHamster(item){
    if((typeof item ) !== 'object'){
        return false
    }

    let keys = Object.keys(item)
    if(!keys.includes('name') || !keys.includes('age') || !keys.includes('favFood') || !keys.includes('loves') || !keys.includes('imgName') || !keys.includes('wins') || !keys.includes('defeats') || !keys.includes('games')){
        return false
    }

    return true

}
router.post('/', async (req, res) =>{ 
    let item = req.body
    let HamsterItem = checkHamster(item)
    let docRef = await db.collection(HAMSTERS).add(item)
    console.log('added object to database w id:' + docRef.id )

    let oneHamster = await getOneHamster(docRef.id)
    console.log(oneHamster)

    let array = []

  
    oneHamster.id = docRef.id
    array.push(oneHamster)
    console.log(array)


    if(!HamsterItem){               
        res.status(400).send('Must send a hamster object')
        return
        
    } else{
        // console.log(fullHamster)
        await res.send(oneHamster)
    }
    
})



//functions

async function HamsterObject(id, item){ 
    console.log('updating one document')
    const object = item
    const UpdateData = object
    const docRef = db.collection(HAMSTERS).doc(id) // hämta databasobjektet med id från parameter
    const docSnapshot = await docRef.get()

    if( docSnapshot.exists ) {
        const settings = { merge: true}
        return await db.collection(HAMSTERS).doc(id).set(UpdateData, settings)
    }else{
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
    const docSnapshot = await docRef.get() 

    if( docSnapshot.exists ) {
        return await docSnapshot.data()
    }else{
        return null
    }
}

async function deleteOne(id) {

	const docRef = db.collection(HAMSTERS).doc(id)
	const docSnapshot = await docRef.get()
    if(docSnapshot.exists){
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
            
        let wins = array[i].wins
        let def = array[i].defeats
        let calcit = wins / def
        let multi =  calcit * def

        if(isNaN(multi)) multi = 0; //omvandlar alla NaN till 0, om ex ej har vunnit/förlorat ngt
        cutest[i] = multi; //returnera värde på wins i alla obj
    }

    let finalResult = Math.max(...cutest) // får ut högsta talet här på wins.        
    let winning = array.find(({wins}) => wins === finalResult) //hittar värde array som har samma värde som högst resultat
        
    if(winning){
        return winning
        }else{
            return null       
        }
}


module.exports = router, getHamsters
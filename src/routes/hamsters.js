const express = require('express')
const router = express.Router()

const database = require('../database.js')
const connect = database.connect
const db = connect()
const HAMSTERS = 'hamsters'

router.get('/', async (req, res) =>{ 
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

router.get('/:id', async (req, res)=>{ 
    const idHam = await getOneHamster(req.params.id) 
    
    let array = []

    idHam === req.params.id
    array.push(idHam)
    
    if(!idHam){
        res.sendStatus(404)
        return
    }
    res.status(200).send(idHam)    
})

 router.put('/:id', async (req, res) =>{ 
     const item = req.body
     const updateArray = await HamsterObject(req.params.id,item)

     if( Object.keys(req.body).length === 0 ){
         res.sendStatus(400)
     }else{
         if( !updateArray ){
            res.sendStatus(404)
        } else{
            res.sendStatus(200)
            return
        }
     } 
})

router.delete('/:id', async (req, res) =>{ 
    let deleted = await deleteOne(req.params.id)
    if(!deleted ){
        res.sendStatus(404)
    }else{
        res.sendStatus(200)
        return
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

    let arrayOne = []

  
    oneHamster.id = docRef.id
    arrayOne.push(oneHamster)
    console.log(arrayOne)


    if(!HamsterItem){               
        res.status(400).send('Must send a hamster object')
        return
        
    } else{
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
    const HamsterRef = db.collection(HAMSTERS)
    const HamsterSnapshot = await HamsterRef.get()

    if(HamsterSnapshot.empty) {
        return []
    }

    const array = []
    await HamsterSnapshot.forEach(async HamsterRef =>{
        const data = await HamsterRef.data()
        data.id = HamsterRef.id
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

    for(let i = 0; i < array.length; i++){

        let cute = {}

        let wins = array[i].wins
        let def = array[i].defeats
        let calcit = wins - def
        let score =  calcit + def

        if(isNaN(score)) score = 0; //omvandlar alla NaN till 0, om ex ej har vunnit/förlorat ngt

        cute.score = score
        cute.name = array[i].name
        cute.age = array[i].age
        cute.favFood = array[i].favFood
        cute.loves = array[i].loves
        cute.imgName = array[i].imgName
        cute.wins = array[i].wins
        cute.defeats = array[i].defeats
        cute.games = array[i].games
        cute.id = array[i].id
        cutest.push(cute)
    }

const highestNumber = []
     for (let i = 0; i < array.length; i++){ 
            
         let wins = array[i].wins
         let def = array[i].defeats
         let calcit = wins - def
         let multi =  calcit + def

         if(isNaN(multi)) multi = 0; //omvandlar alla NaN till 0, om ex ej har vunnit/förlorat ngt
         highestNumber[i] = multi; //returnera värde på wins i alla obj
     }

     let finalResult = Math.max(...highestNumber) // får ut högsta talet här på wins.

     let winning = cutest.filter(function(cutie) {
         return cutie.score === finalResult
     })

     if(winning){
         return winning
         }else{
             return null       
         }
}


module.exports = router, getHamsters
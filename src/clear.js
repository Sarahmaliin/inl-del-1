const { connect } = require('./database.js')
const db = connect()

const HAMTERS = 'hamsters'

clear();

async function clear() {
	const usersRef = db.collection(HAMTERS)
	const usersSnapshot = await usersRef.get()

	if( usersSnapshot.empty ) {
		return
	}

	usersSnapshot.forEach(docRef => {
		usersRef.doc(docRef.id).delete()
		// Vi behöver inte await - inget att vänta på
	})
}

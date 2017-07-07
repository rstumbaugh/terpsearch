// interface for dealing with local storage
// barebones for now, but allows ability to set expirations, etc of data

class Store {
	constructor() {
		this.store = window.localStorage;
	}

	getItem(itemName) {
		return this.store.getItem(itemName);
	}

	setItem(itemName, value) {
		this.store.setItem(itemName, value);
		console.log('stored ' + itemName);
		console.log(value);
	}
}

export default new Store();
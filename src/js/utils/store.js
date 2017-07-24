// interface for dealing with local storage
// barebones for now, but allows ability to set expirations, etc of data

class Store {
	constructor() {
		this.store = window.localStorage;
	}

	getItem(itemName) {
		var item = this.store.getItem(itemName);
		return item === null ? '' : item
	}

	setItem(itemName, value) {
		this.store.setItem(itemName, value);
	}
}

export default new Store();
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

	addHistoryItem(name, path) {
		var history = this.store.getItem('history');
		history = history === null ? [] : JSON.parse(history);
		history.push({ name, path });
		this.store.setItem('history', JSON.stringify(history));
	}

	getHistory() {
		var history = this.store.getItem('history');
		history = history === null ? [] : JSON.parse(history);
		return history;
	}
}

export default new Store();
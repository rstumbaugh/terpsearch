import Store from 'utils/store';

// handle page changes, keep track of local history via localStorage
// certain pages will clear history (home page, search page)
// used to populate Breadcrumb on top of some pages
class History {
	get() {
		var history = Store.getItem('history');
		history = history === null ? [] : JSON.parse(history);
		return history;
	}

	// add new record to history
	push({ href, pageName }) {
		var history = this.get();
		history.push({ href, pageName });
		Store.setItem('history', JSON.stringify(history));
	}

	// remove item from history. if URL provided, remove
	// everything after and including the URL. else, just pop last element
	pop(href = '') {
		var idx = -1;
		var history = this.get();
		
		history.forEach((item, i) => {
			idx = item.href == href ? i : idx
		})

		history.splice(idx);
		Store.setItem('history', JSON.stringify(history));
	}

	// reset history
	clear() {
		Store.setItem('history', '[]');
	}
}

export default new History();
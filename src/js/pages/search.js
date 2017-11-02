import React, {Component} from 'react';

import {Header, Content, Footer} from 'utils/layout.js';
import Globals from 'globals';
import SearchBox from 'components/search/search-box.js';
import SearchSummary from 'components/search/search-summary.js';
import SearchResults from 'components/search/search-results.js';
import History from 'utils/history';
import Ajax from 'utils/ajax';

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			form: {},
			numResults: 0,
			results: [],
			status: 'waiting',
			page: 1
		};

		this.updateSearch = (state) => props.updateState('search', state);
	}

	componentDidMount() {
		History.clear();
		this.setState(this.props.state ? this.props.state : this.state);
	}

	componentWillReceiveProps(nextProps) {
		// if user already searched, populate state from App
		const state = nextProps.state;
		if (state) {
			this.setState(state)
		}
	}

	onQueryUpdate(query) {
		if (!query) return;
		var self = this;
		var page = query.per_page == this.state.form.per_page ? this.state.page : 1;
		
		// do this first so UI updates before waiting for response
		this.setState({
			status: 'loading',
			form: query
		})

		var queryString = this.generateQueryString(query);
		
		Ajax.get(Globals.API_COURSES + queryString)
			.then(res => JSON.parse(res.response))
			.then(response => {
				self.setState({
					numResults: response[0].total_matches,
					results: response[1],
					status: 'done',
					page
				}, () => {
					// pass search back to App to persist
					self.updateSearch(self.state)
				})
			})
			.catch(err => {
				console.error(err);
			})
	}

	// generate query string from search form data
	generateQueryString(form) {
		var query = '?';

		for (var field in form) {
			var value = form[field];

			query += field + '=';

			if (value instanceof Array) {
				query
				query += encodeURIComponent(value.map(x => x.value ? x.value : x).join(','));
			} else if (value instanceof Object) {
				query += encodeURIComponent(value.value); // get sort.value
			} else {
				query += encodeURIComponent(value);
			}

			query += '&';
		}

		var page = form.per_page == this.state.form.per_page ? this.state.page : 1;
		query = query.replace(/%2C/g, ',');
		query += `page=${page}`; // add page to query

		return query;
	}

	// update page item in state, page is appended to querystring 
	// 	rather than stored with form data
	onPageChange(newPage) {
		var self = this;
		this.setState({
			page: newPage
		}, function() {
			self.onQueryUpdate(self.state.form)
		})
	}

	render() {
		// use regex to get number of items per page
		var matches = this.state.form ? this.state.form.per_page : 25;
		return (
			<div>
				<Header />
				<Content offset>
					<div className='search-wrap'>
						<SearchBox 
							formData={this.state.form}
							updateQuery={this.onQueryUpdate.bind(this)} />
						<SearchSummary
							page={this.state.page}
							perPage={matches}
							numResults={this.state.results.length}
							totalResults={this.state.numResults}
							showSummary={this.state.status == 'done'}
							onPageChange={this.onPageChange.bind(this)}
						/>
						<SearchResults
							numResults={this.state.numResults} 
							results={this.state.results}
							status={this.state.status} 
						/>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default Search;
import React, {Component} from 'react';

import {Header, Content, Footer} from 'utils/layout.js';
import Globals from 'globals';
import SearchBox from 'components/search/search-box.js';
import SearchSummary from 'components/search/search-summary.js';
import SearchResults from 'components/search/search-results.js';
import Store from 'utils/store';
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
		var self = this;
		// do this first so UI updates before waiting for response
		this.setState({
			status: 'loading'
		})

		var queryString = this.generateQueryString(query);

		Ajax.get(Globals.API_COURSES + queryString)
			.then(res => JSON.parse(res.response))
			.then(response => {
				self.setState({
					form: query,
					numResults: response[0].total_matches,
					results: response[1],
					status: 'done'
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

		query = query.replace(/%2C/g, ',');
		query += `page=${this.state.page}`; // add page to query

		return query;
	}

	// update page item in state, page is appended to querystring 
	// 	rather than stored with form data
	onPageChange(newPage) {
		var self = this;
		this.setState({
			page: newPage
		}, function() {
			self.onQueryUpdate(self.onQueryUpdate(self.state.form))
		})
	}

	render() {
		// use regex to get number of items per page
		var matches = this.state.query ? this.state.query.per_page : 25;
		return (
			<div>
				<Header />
				<Content offset>
					<div className='search-wrap'>
						<SearchBox 
							formData={this.state.form}
							updateQuery={this.onQueryUpdate.bind(this)} />
						<SearchSummary
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
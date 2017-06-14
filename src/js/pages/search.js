import styles from 'styles/search.scss';
import React, {Component} from 'react';
import * as isofetch from 'isomorphic-fetch'

import Header from 'components/header.js';
import Footer from 'components/footer.js';
import Globals from 'components/globals.js';
import SearchBox from 'components/search/search-box.js';
import SearchSummary from 'components/search/search-summary.js';
import SearchResults from 'components/search/search-results.js';

class Search extends Component {
	constructor() {
		super();

		this.state = {
			query: '',
			numResults: 0,
			results: [],
			status: 'waiting',
			reviewSubmitted: false
		};
	}

	onQueryUpdate(query) {
		var self = this;
		this.setState({
			status: 'loading',
			query: query
		})
		fetch(Globals.API_COURSES + query)
			.then(Globals.handleFetchResponse)
			.then(function(response) {
				self.setState({
					numResults: response[0].total_matches,
					results: response[1],
					status: 'done'
				})
			})
	}

	onPageChange(newPage) {
		var self = this;
		this.setState({
			query: this.state.query.replace(/&page=\d+/, '') + '&page=' + newPage
		}, function() {
			self.onQueryUpdate(self.state.query)
		})
	}

	render() {
		// use regex to get number of items per page
		var matches = this.state.query.match(/per_page=(\d+)/);
		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-md-10 col-md-offset-1 search-wrap'>
							<div className='search-box-wrap card'>
								<SearchBox updateQuery={this.onQueryUpdate.bind(this)} />
							</div>
							<br/>
							<div className='search-results-wrap'>
								<SearchSummary
									perPage={matches ? matches[1] : 25}
									numResults={this.state.results.length}
									totalResults={this.state.numResults}
									showSummary={this.state.status == 'done'}
									onPageChange={this.onPageChange}
								/>
								<SearchResults
									numResults={this.state.numResults} 
									results={this.state.results}
									status={this.state.status} 
								/>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

export default Search;
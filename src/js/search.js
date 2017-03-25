var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./modules/header.js');
var Footer = require('./modules/footer.js');
var SearchBox = require('./modules/search/search-box.js');
var SearchSummary = require('./modules/search/search-summary.js');
var SearchResults = require('./modules/search/search-results.js');
var Globals = require('./modules/globals.js');
require('es6-promise').polyfill();
require('isomorphic-fetch');


var App = React.createClass({
	render: function() {
		var matches = this.state.query.match(/per_page=(\d+)/);

		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-sm-10 col-sm-offset-1 search-wrap'>
							<SearchBox updateQuery={this.onQueryUpdate} />
							<br/>
							<br/>
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
								status={this.state.status} />
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	},
	onPageChange: function(newPage) {
		var self = this;
		this.setState({
			query: this.state.query.replace(/&page=\d+/, '') + '&page=' + newPage
		}, function() {
			self.onQueryUpdate(self.state.query)
		})
	},
	onQueryUpdate: function(query) {
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
	},
	getInitialState: function() {
		return {
			query: '',
			numResults: 0,
			results: [],
			status: 'waiting'
		}
	}
})

ReactDOM.render(<App />, document.getElementById('app'));
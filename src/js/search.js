var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var Header = require('./modules/header.js');
var Footer = require('./modules/footer.js');
var RatingForm = require('./modules/rating/rating-form.js');
var SearchBox = require('./modules/search/search-box.js');
var SearchSummary = require('./modules/search/search-summary.js');
var SearchResults = require('./modules/search/search-results.js');
var Globals = require('./modules/globals.js');
require('es6-promise').polyfill();
require('isomorphic-fetch');


var App = React.createClass({
	render: function() {
		var matches = this.state.query.match(/per_page=(\d+)/);
		var modalStyle = {
			content: {
				width: '50%',
				marginLeft: 'auto',
				marginRight: 'auto',
				padding: '15px 30px'
			}
		}
		var modal = 
			<Modal 
				isOpen={true} 
				contentLabel='Rating Form'
				style={modalStyle}
			>
				<h1>Testing</h1>
				<RatingForm />
			</Modal>

		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-sm-10 col-sm-offset-1 search-wrap'>
							{modal}
							<div className='search-box-wrap card'>
								<SearchBox updateQuery={this.onQueryUpdate} />
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
									status={this.state.status} />
							</div>
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
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
		var self = this;
		var matches = this.state.query.match(/per_page=(\d+)/);
		var buttonStyle = {
			display: this.state.reviewSubmitted ? '' : 'none'
		}
		var modal = 
			<Modal 
				isOpen={this.state.showModal} 
				contentLabel='Rating Form'
				onRequestClose={function() {
					self.setState({
						showModal: false
					}
				)}}
				shouldCloseOnOverlayClick={false}
				overlayClassName='rating-modal-overlay'
				className='rating-modal'
			>
				<h1>A quick favor...</h1>
				<p style={{fontSize: '16px'}}>
					This site is powered by student-contributed ratings. In order to make this successful,
					we need all the ratings we can get. Please take a second to submit <strong>one </strong> 
					course rating and contribute to the site.
				</p>
					<div style={{width: '100%', textAlign: 'center'}}>
					<div className='btn btn-primary' style={buttonStyle} onClick={function() {self.toggleModal(false)}}>
						Thanks!
					</div>
				</div>
				<br/>
				<RatingForm 
					onSuccess={function() {
						self.setState({
							reviewSubmitted: true
						})
					}}
				/>
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
	toggleModal: function(show) {
		this.setState({
			showModal: show
		})
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
			status: 'waiting',
			showModal: true,
			reviewSubmitted: false
		}
	}
})

ReactDOM.render(<App />, document.getElementById('app'));
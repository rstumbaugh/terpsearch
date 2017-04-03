var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./modules/header.js');
var BackPanel = require('./modules/back-panel.js');
var Comments = require('./modules/info/info-comments.js');
var Footer = require('./modules/footer.js');
var Globals = require('./modules/globals.js');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var App = React.createClass({
	getInitialState: function() {
		var queryString = Globals.getQueryString();

		return {
			id: queryString.id,
			type: queryString.type,
			comments: []
		}
	},

	componentDidMount: function() {
		// load comments
		var url;
		var self = this;

		if (this.state.type == 'course') {
			url = Globals.API_COURSE_COMMENTS + '?course_id=';
		} else if (this.state.type == 'prof') {

		}

		if (url) {
			fetch(url + encodeURIComponent(this.state.id))
				.then(Globals.handleFetchResponse)
				.then(function(response) {
					self.setState({
						comments: response
					})
				})
				.catch(function(err) {
					console.log(err)
				})
		}
	},

	render: function() {
		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-sm-10 col-sm-offset-1'>
							<BackPanel 
								location='course page'
							/>
							<div className='card'>
								<h1>{decodeURIComponent(this.state.id)}</h1>
								<Comments
									comments={this.state.comments}
								/>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
})


ReactDOM.render(<App />, document.getElementById('app'));
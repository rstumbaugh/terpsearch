var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./modules/header.js');
var Footer = require('./modules/footer.js');
var RatingForm = require('./modules/rating/rating-form.js');
var globals = require('./modules/globals.js');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var Feedback = React.createClass({
	getInitialState: function() {
		return {
			feedback: '',
			message: '',
			slideClass: 'slide closed'
		}
	},
	handleChange: function(e) {
		this.setState({
			feedback: e.target.value
		})
	},
	handleSubmit: function() {
		if (this.state.feedback.length > 0) {
			var self = this;
			fetch(globals.API_ADD_FEEDBACK, {
				method: 'post',
				headers: {
			    	'Accept': 'application/json',
			    	'Content-Type': 'application/json'
			    },
				body: JSON.stringify({ msg: this.state.feedback })
			})
			.then(globals.handleFetchResponse)
			.then(function(response) {
			  	self.setState({
					feedback: '',
					message: 'Thanks!',
					slideClass: 'slide open'
				})
			}).catch(function(err) {
				self.setState({
					message: 'Something went wrong...',
					slideClass: 'slide open'
				})
			})
		}
	},
	render: function() {
		return (
			<div>
				<div className="form-group col-sm-12">
	                <textarea 
	                	id="txtFeedback" 
	                	cols="30" rows="6" 
	                	placeholder="Leave a comment here..." 
	                	className="form-control"
	                	value={this.state.feedback}
	                	onChange={this.handleChange}>
	                	</textarea>
	            </div>
	            <div className="form-group">
	                <div className="button-wrap col-xs-2">
	                    <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
	                </div>
	                
	                <div className='message-wrap col-xs-10'>
	                	<div className={this.state.slideClass}>
	                    	{this.state.message}
	                    </div>
	                </div>
	            </div>
	        </div>
		)
	}
})

ReactDOM.render(<Feedback />, document.getElementById('feedback'));
ReactDOM.render(<RatingForm />, document.getElementById('ratingForm'));
ReactDOM.render(<Footer />, document.getElementById('footer'));
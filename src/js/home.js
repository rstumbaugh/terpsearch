require('es6-promise').polyfill();
require('isomorphic-fetch');
var globals = require('./modules/globals.js');

var EmailBox = React.createClass({
	getInitialState: function() {
		return {
			email: '',
			message: '',
			slideClass: 'message-wrap slide closed',
			test: 'red'
		}
	},
	handleChange: function(e) {
		this.setState({
			email: e.target.value,
			message: '',
			slideClass: 'slide closed'
		});
	},
	handleSubmit: function() {
		
		if (this.state.email.match(globals.EMAIL_REGEX)) {
			var self = this;

			fetch(globals.API_ADD_EMAIL, {
				method: 'post',
				headers: {
			    	'Accept': 'application/json',
			    	'Content-Type': 'application/json'
			    },
				body: JSON.stringify({ 'email': this.state.email })
			})
			.then(globals.handleFetchResponse)
		    .then(function(response) {
				self.setState({
					email: '',
					message: 'Thanks!',
					slideClass: 'slide open'
				})
			})
			.catch(function(err) {
				self.rejectEmail();
			})
		} else {
			this.rejectEmail();
		}
		
	},
	rejectEmail: function() {
		this.setState({
			message: 'Please enter a valid email.',
			slideClass: 'slide open'
		});
	},
	render: function() {
		return (
			<div>
				<div className="input-group">
					<input type="text" 
						   className="form-control" 
						   placeholder="me@example.com" 
						   value={this.state.email}
						   onChange={this.handleChange}>
					</input>
		            <span className="input-group-btn">
		            	<button className="btn btn-default" onClick={this.handleSubmit}>Go!</button>
		        	</span>
		        </div>
		        <br/>
	            <div className={'message-wrap '+this.state.slideClass}>
	            	{this.state.message}
	            </div>
	        </div>
		)
	}
});

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
	                
	                <div className={'message-wrap col-xs-10 ' + this.state.slideClass}>
	                    {this.state.message}
	                </div>
	            </div>
	        </div>
		)
	}
})

React.render(<EmailBox />, document.getElementById('email'));
React.render(<Feedback />, document.getElementById('feedback'));
var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./modules/header.js');
var Footer = require('./modules/footer.js');
var Globals = require('./modules/globals.js');

var Feedback = React.createClass({
	getInitialState: function() {
		return {
			feedback: '',
			email: '',
			message: '',
			slideClass: 'slide closed'
		}
	},
	handleChange: function(e) {
		this.setState({
			feedback: e.target.value
		})
	},
	handleEmailChange: function(e) {
		this.setState({
			email: e.target.value
		})
	},
	handleSubmit: function() {
		if (this.state.feedback.length > 0) {
			var self = this;
			fetch(Globals.API_ADD_FEEDBACK, {
				method: 'POST',
				headers: {
			    	'Accept': 'application/json',
			    	'Content-Type': 'application/json'
			    },
				body: JSON.stringify({ msg: this.state.feedback, email: this.state.email })
			})
			.then(Globals.handleFetchResponse)
			.then(function(response) {
			  	self.setState({
					feedback: '',
					email: '',
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
			<div className='row' style={{paddingBottom: '50px'}}>
				<div className='form-group col-sm-6'>
					<label>Email</label>
					<br/>
					<input 
						type='text' 
						className='form-control' 
						value={this.state.email}
						onChange={this.handleEmailChange}
						placeholder='test@example.com'
					/>
				</div>
				<div className='clearfix'></div>
				<div className="form-group col-sm-12">
					<label>Message</label>
					<br/>
	                <textarea 
	                	id="txtFeedback" 
	                	cols="30" rows="6" 
	                	placeholder="Leave a comment here..." 
	                	className="form-control"
	                	value={this.state.feedback}
	                	onChange={this.handleChange}>
	                	</textarea>
	            </div>
	            <div className="form-group col-sm-12">
	                <div className="button-wrap col-xs-2">
	                    <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
	                </div>
	                
	                <div className='message-wrap col-xs-10' style={{fontSize: '14px'}}>
	                	<div className={this.state.slideClass}>
	                    	{this.state.message}
	                    </div>
	                </div>
	            </div>
	        </div>
		)
	}
})

var App = React.createClass({
	render: function() {
		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='col-md-10 col-md-offset-1'>
						<h1>Feedback</h1>
						<br/>
						<p style={{fontSize: '16px'}}>
							Experience any errors or strange behavior using this application?
							Have any questions, comments, or suggestions? Leave your feedback here
							and we will look into it! You can choose to leave your email as well if you would
							like a response. 
							<br/><br/>
							For developers, you can visit the 
							<a href='https://github.com/rstumbaugh/terpsearch' target='_blank'> GitHub page </a>
							for this website to report an issue or just poke through the front-end code.
							You can also send an email to <a href='mailto:admin@terpsearch.me'>admin@terpsearch.me</a>.
						</p>
						<br/>
						<Feedback />
					</div>
				</div>
				<Footer />
			</div>
		)
	}
})


ReactDOM.render(<App />, document.getElementById('app'))
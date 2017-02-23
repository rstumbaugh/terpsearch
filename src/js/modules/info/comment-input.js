var React = require('react');
var Globals = require('../globals.js');
require('es6-promise').polyfill();
require('isomorphic-fetch');


var CommentInput = React.createClass({
	getInitialState: function() {
		return {
			feedbackClass: 'slide closed',
			feedback: '',
			error: false,
			text: '',
			name: ''
		}
	},

	handleChange: function(e) {
		var left = this.props.minLength - e.target.value.length;

		this.setState({
			text: e.target.value
		})
	},

	handleSubmit: function() {
		var self = this;

		this.setState({
			error: false,
			feedbackClass: '',
			feedback: ''
		});

		if (this.state.text.length < this.props.minLength) {
			this.setState({
				error: true,
				feedbackClass: 'error-msg slide open',
				feedback: 'Comment must be at least ' + this.props.minLength + ' characters.'
			})
		} else {
			var body = this.props.getRequestBody({
				text: this.state.text,
				name: this.state.name || 'anonymous'
			});

			fetch(Globals.API_COURSE_COMMENTS, {
				method: 'post',
				'headers': {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})
			.then(Globals.handleFetchResponse)
			.then(function(response) {
				self.setState({
					feedbackClass: 'success-msg slide open',
					feedback: 'Comment successfully submitted.',
					text: '',
					name: ''
				})
			})
		}
	},

	render: function() {
		var self = this;
		var charsLeft = this.props.minLength - this.state.text.length;
		charsLeft = charsLeft > 0 ? charsLeft : 0;

		return (
			<div className='row comment-input'>
				<fieldset>
					<legend>Add a comment</legend>
					<div className={'col-md-12 form-group ' + (this.state.error ? 'has-error' : '')}>
						<label>{'Enter comment below (at least ' + this.props.minLength + ' characters):'}</label>
						<textarea 
							type='text' 
							value={this.state.text}
							rows={this.props.rows} 
							className={'form-control ' + this.props.className} 
							onChange={this.handleChange} />
						<p className='help-block'>
							{charsLeft + ' characters remaining.'}
						</p>
					</div>
					<div className='col-md-12 form-group'>
						<label>Enter name to display (leave blank for anonymous)</label>
						<input 
							className='form-control'
							type='text' 
							value={this.state.name}
							onChange={function(e) {self.setState({name: e.target.value})}}
							placeholder='anonymous'
						/>
					</div>
					<div className='col-md-3 button-wrap'>
						<div className='btn btn-primary' onClick={this.handleSubmit}>Submit</div>
					</div>
					<div className='col-md-6 feedback-wrap'>
						<p className={this.state.feedbackClass}>
							{this.state.feedback}
						</p>
					</div>
				</fieldset>
			</div>
		)
	}
})


module.exports = CommentInput;
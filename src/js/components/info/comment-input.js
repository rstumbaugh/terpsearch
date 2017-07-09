import React, {Component} from 'react';
import Globals from 'globals';
import Ajax from 'utils/ajax';

class CommentInput extends Component {
	constructor() {
		super();

		this.state = {
			feedbackClass: 'slide closed',
			feedback: '',
			error: false,
			text: '',
			name: ''
		};
	}

	handleChange(e) {
		this.setState({
			text: e.target.value
		})
	}

	handleSubmit() {
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

			Ajax.post(Globals.API_COURSE_COMMENTS, {
				body: JSON.stringify(body)
			})
				.then(res => res.response)
				.then(function(response) {
					self.setState({
						feedbackClass: 'success-msg slide open',
						feedback: 'Comment successfully submitted.',
						text: '',
						name: ''
					})
				})
				.catch(err => console.error(err))
		}
	}

	render() {
		var self = this;
		var charsLeft = this.props.minLength - this.state.text.length;
		charsLeft = charsLeft > 0 ? charsLeft : 0;

		return (
			<div className='info-comment-input row'>
				<fieldset>
					<legend>Add a comment</legend>
					<div className={'col-md-12 form-group ' + (this.state.error ? 'has-error' : '')}>
						<label>{'Enter comment below (at least ' + this.props.minLength + ' characters):'}</label>
						<textarea 
							type='text' 
							value={this.state.text}
							rows={this.props.rows} 
							className={'form-control ' + this.props.className} 
							onChange={this.handleChange.bind(this)} />
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
					<div className='info-comment-button-wrap col-md-3'>
						<div className='btn btn-primary' onClick={this.handleSubmit.bind(this)}>Submit</div>
					</div>
					<div className='info-comment-feedback-wrap col-md-6'>
						<p className={this.state.feedbackClass}>
							{this.state.feedback}
						</p>
					</div>
				</fieldset>
			</div>
		)
	}
}

export default CommentInput;
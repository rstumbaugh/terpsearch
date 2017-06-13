import React, {Component} from 'react';
import Globals from 'components/globals.js';

class Feedback extends Component {
	constructor() {
		super();

		this.state = {
			feedback: '',
			email: '',
			message: '',
			slideClass: 'slide closed'
		};
	}

	handleChange(field, e) {
		var s = {};
		s[field] = e.target.value;
		this.setState(s);
	}

	handleSubmit() {
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
	}

	render() {
		return (
			<div className='row' style={{paddingBottom: '50px'}}>
				<div className='form-group col-sm-6'>
					<label>Email</label>
					<br/>
					<input 
						type='text' 
						className='form-control' 
						value={this.state.email}
						onChange={this.handleChange.bind(this, 'email')}
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
          	onChange={this.handleChange.bind(this, 'feedback')}>
          </textarea>
        </div>
        <div className="form-group col-sm-12">
          <div className="button-wrap col-xs-2">
            <button className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit</button>
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
}

export default Feedback;
import React, {Component} from 'react';
import RatingFormComponent from './rating-form-component.js';
import StarRating from './star-rating.js';
import RemoteSimpleSelect from 'components/remote-simple-select.js';
import Globals from 'globals';
import Ajax from 'utils/ajax';
import Auth from 'utils/auth';
import Store from 'utils/store';
import History from 'utils/history';

class RatingForm extends Component {
	constructor() {
		super();
		
		this.state = {
			courseId: '',
			professor: '',
			difficulty: 1,
			interest: 1,
			courseError: false,
			profError: false,
			messageClass: 'slide closed'
		}
	}

	// update state from form item
	handleChange(field, value) {
		var s = {};
		s[field] = value;
		this.setState(s);
	}

	submitRating(e) {
		e.preventDefault(); // don't submit form
		// check that course and prof is entered
		
		this.setState({
			courseError: this.state.courseId == '',
			profError: this.state.professor == '',
			messageClass: 'slide closed'
		});

		if (this.state.courseId && this.state.professor) {
			this.setState({
				courseError: false,
				profError: false
			})
			
			var user = Auth.getCurrentUser();
			var rating = {
				courseId: this.state.courseId,
				prof: this.state.professor,
				difficulty: this.state.difficulty,
				interest: this.state.interest,
				userId: user ? user.providerData[0].uid : undefined
			};
			
			// moved this method outside promise success to avoid UI hanging
			this.setState({
				courseId: '',
				professor: '',
				difficulty: 1,
				interest: 1,
				courseError: false,
				profError: false,
				messageClass: 'slide open',
				message: 'Submitting...'
			})

			// post rating, send auth params
			// redirect to UMD login page if not authorized
			var redirectUrl = `${window.location.origin}/auth/redirect`;
			redirectUrl += `?type=ratings&data=${encodeURIComponent(JSON.stringify(rating))}`
			Ajax.post(Globals.API_SUBMIT_RATING, {
				headers: {
					'Authorization': Store.getItem('userToken'),
					'X-Auth-Ticket': Store.getItem('authTicket'),
					'X-Auth-Service': redirectUrl.split('?')[0]
				},
				body: JSON.stringify(rating)
			})
			.then(response => {
				this.setState({
					messageClass: 'success slide open',
					message: response.response
				})
			})
			.catch(err => {
				if (err.code == 401) {
					var href = window.location.pathname;
					var pageName = window.location.pathname.split('/')[1];
					pageName = pageName ? Globals.capitalize(pageName) : 'Home';
					History.push({href, pageName});
					History.push({href: 'noClear', pageName: ''});
					
					window.location.href = redirectUrl;
				}
				
				this.setState({
					messageClass: 'error slide open',
					message: err.response
				})
			})
		}
	}

	render() {
		var courseField = 
			<RemoteSimpleSelect 
				placeholder='Enter a course ID'
				url={Globals.API_LIST_COURSES + '?course_id='}
				textField='course_id' 
				name='courseId'
				value={this.state.courseId}
				onChange={this.handleChange.bind(this)}
			/>;
		var profField = 
			<RemoteSimpleSelect 
				placeholder='Enter a professor'
				url={Globals.API_PROFS + '?q='}
				textField='name'
				name='professor'
				value={this.state.professor}
				onChange={this.handleChange.bind(this)}
			/>;
		var diffRating = 
			<StarRating 
				updatable
				rating={this.state.difficulty} 
				name='difficulty'
				updateRating={this.handleChange.bind(this)}
			/>

		var intRating = 
			<StarRating 
				updatable
				rating={this.state.interest} 
				name='interest'
				updateRating={this.handleChange.bind(this)}
			/>
		return (
			<div className='row rating-form'>
				<form id="courseForm" className="form-horizontal">
					<fieldset>
						<legend>Submit a course</legend>
						<RatingFormComponent 
								component={courseField}
								labelText={'Course ID:'}
								error={this.state.courseError}
								errorMessage={'Enter a valid course ID'}
						/>
						<RatingFormComponent 
								component={profField}
								labelText={'Professor:'}
								error={this.state.profError}
								errorMessage={'Enter a professor\'s name'}
						/>
						<RatingFormComponent 
								component={diffRating}
								labelText={'Difficulty:'}
								message={'1 star = Very Easy, 5 stars = Very Difficult'}
						/>
						<RatingFormComponent 
								component={intRating}
								labelText={'Interest:'}
								message={'1 star = Very Boring, 5 stars = Very Interesting'}
						/>
						<div className='col-sm-12'>
							<button className='full-width btn-blue' 
									onClick={this.submitRating.bind(this)}>
									Submit
							</button>
						</div>
						<div className='feedback-wrap col-sm-12'>
							<p className={'form-feedback ' + this.state.messageClass}>
								{ this.state.message }
							</p>
						</div>
					</fieldset>
				</form>
			</div>
		)
	}
}

export default RatingForm;


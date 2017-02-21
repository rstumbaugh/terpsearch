var React = require('react');
var RatingFormComponent = require('./rating-form-component.js');
var StarRating = require('./star-rating.js');
var RemoteSimpleSelect = require('./remote-simple-select.js');
var Globals = require('./globals.js');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var RatingForm = React.createClass({
	getInitialState: function() {
		return {
			courseId: '',
			professor: '',
			difficulty: 1,
			interest: 1,
			courseError: false,
			profError: false,
			messageClass: 'slide closed'
		}
	},
	handleChange: function(field, value) {
		var s = {};
		s[field] = value;
		this.setState(s);
	},
	handleClick: function(e) {
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
			
			var self = this;
			var rating = {
				course_id: this.state.courseId,
				professor: this.state.professor,
				difficulty: this.state.difficulty,
				interest: this.state.interest
			};

			fetch(Globals.API_SUBMIT_RATING, {
				method: 'post',
				'headers': {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(rating)
			})
			.then(Globals.handleFetchResponse)
			.then(function(response) {
				// on success, reset form and show success message
				self.setState({
					courseId: '',
					professor: '',
					difficulty: 1,
					interest: 1,
					courseError: false,
					profError: false,
					messageClass: 'slide open'
				})

				self.refs.courseField.reset();
				self.refs.profField.reset();
			})
			.catch(function(err) {
				console.log(err);
			})
		}
	},
	render: function() {
		var courseField = <RemoteSimpleSelect 
								placeholder='Enter a course ID'
								url={Globals.API_LIST_COURSES + '?course_id='}
								textField='course_id' 
								name='courseId'
								ref='courseField'
								onValueChange={this.handleChange}
						 />;
		var profField = <RemoteSimpleSelect 
								placeholder='Enter a professor'
								url={Globals.API_PROFS + '?q='}
								textField='name'
								name='professor'
								ref='profField'
								onValueChange={this.handleChange}
						/>;
		var diffRating = <StarRating 
								rating={this.state.difficulty} 
								name='difficulty'
								updateRating={this.handleChange}
						/>

		var intRating = <StarRating 
								rating={this.state.interest} 
								name='interest'
								updateRating={this.handleChange}
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
								message={'1 star = Very Easy, 5 stars = Very Difficult'}
						/>
						<div className='col-sm-12'>
							<button className='full-width btn btn-primary' 
									onClick={this.handleClick}>
									Submit
							</button>
						</div>
						<div className='feedback-wrap col-sm-12'>
							<p className={'success-msg ' + this.state.messageClass}>
								Course successfully submitted.
							</p>
						</div>
					</fieldset>
				</form>
			</div>
		)
	}
})


module.exports = RatingForm;


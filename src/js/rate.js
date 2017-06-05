var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./modules/header.js');
var Footer = require('./modules/footer.js');
var RatingForm = require('./modules/rating/rating-form.js');

var App = React.createClass({
	render: function() {
		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-sm-10 col-sm-offset-1'>
							<h1>Course Rating Form</h1>
							<p>
								Course ratings keep the site going. Every contribution counts,
								so your rating counts! Feel free to rate as many courses as you can,
								as more ratings means more information to use while helping students
								find the courses that are right for them.
							</p>
							<br/>
							<div className='col-lg-6 col-lg-offset-3'>
								<RatingForm />
								<br/>
								<br/>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
})

ReactDOM.render(<App />, document.getElementById('app'))
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import Home from 'pages/home.js';
import Search from 'pages/search.js';
import Course from 'pages/course.js';
import Feedback from 'pages/feedback.js';
import Rating from 'pages/rating.js';

class App extends React.Component {
	render () {
		return (
			<BrowserRouter>
				<div>
					<Route exact path='/' component={Home} />
					<Route path='/search' component={Search} />
					<Route path='/course/:courseId' component={Course} />
					<Route path='/feedback' component={Feedback} />
					<Route path='/rate' component={Rating} />
				</div>
			</BrowserRouter>
		)
	}
}


ReactDOM.render(<App />, document.getElementById('app'));
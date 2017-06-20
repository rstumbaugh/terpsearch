import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import Home from 'pages/home.js';
import Search from 'pages/search.js';
import Course from 'pages/course.js';
import Feedback from 'pages/feedback.js';
import Rating from 'pages/rating.js';
import Admin from 'pages/admin.js';
import Comments from 'pages/comments.js';

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
					<Route path='/admin' component={Admin} />
					<Route path='/comments', component={Comments} />
				</div>
			</BrowserRouter>
		)
	}
}


ReactDOM.render(<App />, document.getElementById('app'));
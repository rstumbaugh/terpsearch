import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import Home from 'pages/home.js';
import Search from 'pages/search.js';
import Course from 'pages/course.js';

class App extends React.Component {
	render () {
		return (
			<BrowserRouter>
				<div>
					<Route exact path='/' component={Home} />
					<Route path='/search' component={Search} />
					<Route path='/course' component={Course} />
				</div>
			</BrowserRouter>
		)
	}
}


ReactDOM.render(<App />, document.getElementById('app'));
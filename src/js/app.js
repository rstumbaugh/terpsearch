import styles_ from 'styles/styles.scss';
import 'react-select/dist/react-select.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import * as firebase from 'firebase';
import Auth from 'utils/auth';
import Store from 'utils/store';
import Home from 'pages/home.js';
import Search from 'pages/search.js';
import Course from 'pages/course.js';
import Feedback from 'pages/feedback.js';
import Rating from 'pages/rating.js';
import Admin from 'pages/admin.js';
import Comments from 'pages/comments.js';
import Profile from 'pages/profile';
import AuthRedirect from 'pages/auth-redirect';

class App extends React.Component {
	constructor() {
		super();
		
		// initialize firebase app
		var config;
		if (/localhost/.test(window.location.href)) {
			config = {
        apiKey: 'AIzaSyDA2-jPO0hAlAH3NJIOXJj9Ygg9YatKYio',
        authDomain: 'terpsearch-dev.firebaseapp.com',
        databaseURL: 'https://terpsearch-dev.firebaseio.com',
        storageBucket: 'terpsearch-dev.appspot.com',
        messagingSenderId: '378503825008'
      };
		} else {
			config = {
        apiKey: 'AIzaSyAMR4YSAmaxptjscXsoOd33Y3jBHnVUNdw',
        authDomain: 'umd-api-testing.firebaseapp.com',
        databaseURL: 'https://umd-api-testing.firebaseio.com',
        storageBucket: 'umd-api-testing.appspot.com',
        messagingSenderId: '379483876030'
	    };
		}

		firebase.initializeApp(config)

		this.state = {};
	}

	componentDidMount() {
		// save token to store on initial page load
		Auth.onStateChanged(user => {
			if (user) {
				user.getIdToken(true)
					.then(token => {
						// make available regardless of state or timing of function calls
						Store.setItem('userToken', token)
						Store.setItem('userId', user.providerData[0].uid);
					})
					.catch(err => {
						console.error(err)
					})
			} else {
				Store.setItem('userToken', null);
				Store.setItem('userId', null);
			}
		})
	}

	updateState(item, value) {
		var s = {};
		s[item] = value;
		this.setState(s);
	}

	render () {
		return (
			<BrowserRouter>
				<div>
					<Route exact path='/' component={Home} />
					<Route 
						path='/search' 
						render={() => 
							<Search 
								state={this.state.search} 
								updateState={this.updateState.bind(this)}
							/>
						}
					/>
					<Route path='/course/:courseId' component={Course} />
					<Route path='/feedback' component={Feedback} />
					<Route path='/rate' component={Rating} />
					<Route path='/admin' component={Admin} />
					<Route path='/comments/:type/:id' component={Comments} />
					<Route path='/user/:userId/:displayName' component={Profile} />
					<Route path='/user/:userId/ratings' component={Profile} />
					<Route path='/user/:userId/comments' component={Profile} />
					<Route path='/auth/redirect/' component={AuthRedirect} />
				</div>
			</BrowserRouter>
		)
	}
}


ReactDOM.render(<App />, document.getElementById('app'));
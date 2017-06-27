import React, {Component} from 'react';
import * as isofetch from 'isomorphic-fetch';
import {Header, Content, Footer} from 'utils/layout.js';
import CourseComments from 'components/info/info-comments.js';
import Globals from 'globals';

class Comments extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: props.match.params.id,
			type: props.match.params.type,
			comments: []
		};
	}

	componentDidMount() {
		// load comments
		var url;
		var self = this;

		if (this.state.type == 'course') {
			url = Globals.API_COURSE_COMMENTS + '?course_id=';
		} else if (this.state.type == 'prof') {

		}

		if (url) {
			fetch(url + encodeURIComponent(this.state.id))
				.then(Globals.handleFetchResponse)
				.then(function(response) {
					self.setState({
						comments: response
					})
				})
				.catch(function(err) {
					console.log(err)
				})
		}
	}

	render() {
		return (
			<div>
				<Header />
				<Content offset>
					<div className='card info-main'>
						<h1>{decodeURIComponent(this.state.id)}</h1>
						<CourseComments
							comments={this.state.comments}
						/>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default Comments;
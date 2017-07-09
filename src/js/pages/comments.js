import React, {Component} from 'react';
import {Header, Content, Footer} from 'utils/layout.js';
import CourseComments from 'components/info/info-comments.js';
import Globals from 'globals';
import Ajax from 'utils/ajax';

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
			Ajax.get(url + encodeURIComponent(this.state.id))
				.then(res => JSON.parse(res.response))
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
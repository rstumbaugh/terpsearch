import React, {Component} from 'react';
import {Header, Content, Footer} from 'utils/layout.js';
import CourseComments from 'components/info/info-comments.js';
import Globals from 'globals';
import Ajax from 'utils/ajax';
import Breadcrumb from 'components/breadcrumb';

class Comments extends Component {
	constructor(props) {
		super(props);

		const fromLink = props.location.state ? props.location.state.from : '';
		this.state = {
			id: props.match.params.id,
			type: props.match.params.type,
			comments: [],
			fromLink: fromLink,
			fromDisplay: props.location.state && props.location.state.display 
					? props.location.state.display 
					: fromLink
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
					<Breadcrumb />
					<div className='card info-main row'>
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
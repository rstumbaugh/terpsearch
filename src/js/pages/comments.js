import styles from 'styles/info.scss';
import React, {Component} from 'react';
import * as isofetch from 'isomorphic-fetch';
import Header from 'components/header.js';
import Footer from 'components/footer.js';
import CourseComments from 'components/course/info-comments.js';
import Globals from 'components/globals.js';

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
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-sm-10 col-sm-offset-1'>
							<div className='card'>
								<h1>{decodeURIComponent(this.state.id)}</h1>
								<CourseComments
									comments={this.state.comments}
								/>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

export default Comments;
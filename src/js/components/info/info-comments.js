import React, {Component} from 'react';
import Link from 'components/link';

class CourseComments extends Component {
	constructor() {
		super();

		this.state = {
			comments: []
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			comments: nextProps.comments
		})
	}

	getComments() {
		if (this.state.comments.length == 0) {
			return <i>No comments to display.</i>
		}

		var comments = [];

		var max;
		if (this.props.max) {
			max = Math.min(this.state.comments.length, this.props.max);
		} else {
			max = this.state.comments.length;
		}

		for (var i = 0; i < max; i++) {
			// trim comment length
			var comment = this.state.comments[i].comment;
			comment = this.props.maxLength ? comment.slice(0, this.props.maxLength) : comment;
			var trimmed = comment.length < this.state.comments[i].comment.length;
			comment += trimmed ? '...' : ''

			// split into paragraphs
			var paragraphs = comment.split(/\r?\n/);
			var text = [];
			paragraphs.forEach(function(p, i) {
				text.push(p);
				text.push(<br key={i}/>)
			})
			comments.push(
				<div className='info-comment' key={i}>
					<blockquote>
						{text}
						{trimmed ? <i style={{fontSize: '14px'}}><br/>Click "View All" to see the rest</i> : ''}
						<cite>{'\u2014 ' + (this.state.comments[i].name || 'anonymous')}</cite>
					</blockquote>
				</div>
			)
		}

		return <div>{comments}</div>;
	}

	render() {
		var summary;
		var link;

		if (!/comments/.test(window.location.href)) {
			link = 
				<Link to={`/comments/${this.props.type}/${this.props.id}`} pushHistory>
					View all
				</Link>
		}

		if (this.state.comments.length) {
			var max = this.props.max && this.state.comments.length > this.props.max
						? this.props.max 
						: this.state.comments.length
						
			summary = <i>{'Showing ' + max + ' of ' + this.state.comments.length + '.'}</i>
		}

		return (
			<div className='info-comment-wrap'>
				<h2>Comments</h2>
				<div className='info-comment-summary'>
					{summary}
					{link}
				</div>
				<br/>
				{this.getComments()}
			</div>
		)
	}
}

export default CourseComments;
var React = require('react')

var CourseComments = React.createClass({
	getInitialState: function() {
		return {
			comments: []
		}
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			comments: nextProps.comments
		})
	},
	getComments: function() {
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
			comments.push(
				<div className='comment' key={i}>
					<blockquote>
						{this.state.comments[i].comment}
						<cite>{'\u2014 ' + (this.state.comments[i].name || 'anonymous')}</cite>
					</blockquote>
				</div>
			)
		}

		return <div>{comments}</div>;
	},
	render: function() {
		var summary;
		var link;

		if (this.props.max && this.state.comments.length > this.props.max) {
			link = 
				<a href={'comments.html?id=' + this.props.id + '&type=' + this.props.type}>
					View all
				</a>
		}

		if (this.state.comments.length) {
			summary = 
				<i>
					{'Showing ' + (this.props.max ? this.props.max : this.state.comments.length) + ' of ' + 
						this.state.comments.length + '.'}</i>
		}

		return (
			<div className='comment-wrap'>
				<h2>Comments</h2>
				{summary}
				{link}
				<br/>
				{this.getComments()}
			</div>
		)
	}
})

module.exports = CourseComments;
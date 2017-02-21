var React = require('react')

var CourseComments = React.createClass({
	getInitialState: function() {
		return {
			comments: []
		}
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			comments: nextProps.comments
		})
	},
	getComments: function() {
		if (this.state.comments.length == 0) {
			return <i>No comments to display.</i>
		}

		var comments = [];

		for (var i = 0; i < this.state.comments.length; i++) {
			comments.push(
				<div className='comment' key={i}>
					<blockquote>
						{this.state.comments[i].comment}
						<cite>{'\u2014 ' + (this.state.comments[i].name || 'anonymous')}</cite>
					</blockquote>
				</div>
			)
		}

		return comments
	},
	render: function() {
		return (
			<div className='comment-wrap'>
				<h2>Comments</h2>
				{this.getComments()}
			</div>
		)
	}
})

module.exports = CourseComments;
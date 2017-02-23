var React = require('react');

var BackPanel = React.createClass({
	click: function() {
		window.history.back()
	},

	render: function() {
		return (
			<div className='panel panel-default back-panel'>
				<div className='panel-heading'>
					<a onClick={this.click}>
						{'Back ' + (this.props.location ? ' to ' + this.props.location : '')}
					</a>
				</div>
			</div>
		)
	}
})


module.exports = BackPanel;
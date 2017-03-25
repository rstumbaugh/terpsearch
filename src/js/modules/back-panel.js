var React = require('react');

var BackPanel = React.createClass({
	click: function() {
		window.history.back()
	},

	render: function() {
		return (
			<div className='row'>
				<div className='col-md-10 col-md-offset-1'>
					<div className='panel panel-default back-panel'>
						<div className='panel-heading'>
							<a onClick={this.click}>
								{'Back ' + (this.props.location ? ' to ' + this.props.location : '')}
							</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
})


module.exports = BackPanel;
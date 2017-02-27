var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./modules/header.js');
var Footer = require('./modules/footer.js');
var Sidebar = require('./modules/admin/admin-sidebar.js');

var App = React.createClass({
	render: function() {
		return (
			<div>
				<Header />
				<div className='container-fluid content-wrap'>
					<div className='row'>
						<div className='col-sm-2 sidebar-wrap'>
							<Sidebar
								items={['Logs', 'Users', 'Emails', 'Feedback']}
								default='Logs'
								active={this.state.active}
								onActiveChange={this.updateActive}
							/>
						</div>
						<div className='col-sm-10 admin-content'>
							<h1>{this.state.active}</h1>
							{this.getContent()}
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	},

	updateActive: function(active) {
		this.setState({
			active: active
		})
	},

	getContent: function() {
		var active = this.state.active;
		var content;
		
		return <div>{this.state.active + ' is active'}</div>
	},

	getInitialState: function() {
		return {
			status: 'logging in',
			active: 'Logs'
		}
	}
})

ReactDOM.render(<App />, document.getElementById('app'))
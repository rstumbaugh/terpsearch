var EmailBox = React.createClass({
	getInitialState: function() {
		return {
			email: '',
			message: '',
			slideClass: 'message-wrap slide closed',
			test: 'red'
		}
	},
	handleChange: function(e) {
		this.setState({
			email: e.target.value,
			message: '',
			slideClass: 'slide closed'
		});
	},
	handleSubmit: function() {
		
		if (this.state.email == '') {
			this.setState({
				message: 'Enter a valid email.',
				slideClass: 'slide open'
			})
		} else {
			this.setState({
				email: '',
				message: 'Thanks!',
				slideClass: 'slide open'
			})
		}
		
	},
	render: function() {
		return (
			<div>
				<div className="input-group">
					<input type="text" 
						   className="form-control" 
						   placeholder="me@example.com" 
						   value={this.state.email}
						   onChange={this.handleChange}>
					</input>
		            <span className="input-group-btn">
		                <button className="btn btn-default" id="btnEmail" onClick={this.handleSubmit}>Go!</button>
		            </span>
		         </div>
		         <br/>
	            <div className={'message-wrap '+this.state.slideClass}>
	            	{this.state.message}
	            </div>
	        </div>
		)
	}
});

React.render(<EmailBox />, document.getElementById('email'));
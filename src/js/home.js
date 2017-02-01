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

var Feedback = React.createClass({
	getInitialState: function() {
		return {
			message: ''
		}
	},
	handleChange: function(e) {
		this.setState({
			message: e.target.value
		})
	},
	handleSubmit: function() {
		console.log(this.state.message);
		this.setState({
			message: ''
		})
	},
	render: function() {
		return (
			<div>
				<div className="form-group col-sm-12">
	                <textarea 
	                	id="txtFeedback" 
	                	cols="30" rows="6" 
	                	placeholder="Leave a comment here..." 
	                	className="form-control"
	                	value={this.state.message}
	                	onChange={this.handleChange}>
	                	</textarea>
	            </div>
	            <div className="form-group">
	                <div className="button-wrap col-sm-2">
	                    <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
	                </div>
	                
	                <div className="message-wrap col-sm-10">
	                    <p className="help-block"></p>
	                </div>
	            </div>
	        </div>
		)
	}
})

React.render(<EmailBox />, document.getElementById('email'));
React.render(<Feedback />, document.getElementById('feedback'));
var React = require('react');

var Header = React.createClass({
	render: function() {
		var display = this.props.hideFeedback ? 'none' : '';
		var style = {marginTop: '10px', padding: '0 5%', display: display};
		return (
			<div>
				<div id='header' className={'nav-header-wrap' + (this.props.white ? '-white' : '')}>
		            <a href="index.html">TerpSearch</a>
		        </div>
		        <div className='row' style={style}>
		        	<div className='col-sm-12'>
		        		<div className='panel panel-warning'>
		        			<div className='panel-heading' style={{textAlign: 'center'}}>
		        				This site is still in its first versions. If you find any loading errors,
		        				weird formatting, or something that doesn't look right, please 
		        				<a href='feedback.html'> leave some feedback!</a>
		        			</div>
		        		</div>
		        	</div>
		        </div>
		    </div>
		)
	}
})

module.exports = Header;
var React = require('react');

var StarRating = React.createClass({
	getInitialState: function() {
		return {
			rating: this.props.rating,
			toColor: this.props.rating
		}
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			rating: nextProps.rating,
			toColor: nextProps.rating
		})
	},
	colorStars: function(num, e) {
		var event = e.dispatchConfig.registrationName;

		// always color stars on hover
		// only keep rating on mouseLeave if user has clicked a star
		if (event == 'onMouseEnter') {
			this.setState({
				toColor: num + 1
			})
		} else if (event == 'onMouseLeave') {
			this.setState({
				toColor: this.state.rating
			})
		}
	},
	handleClick: function(num, e) {
		this.setState({
			rating: num + 1,
			toColor: num + 1
		})
		this.props.updateRating(this.props.name, num + 1);
	},
	render: function() {
		var stars = [];
		for (var i = 0; i < 5; i++) {
			stars.push(
				<div key={i}
					 className='star'
					 onMouseEnter={this.colorStars.bind(this, i)} 
					 onMouseLeave={this.colorStars.bind(this, i)}
					 onClick={this.handleClick.bind(this, i)}>
					<i className={'glyphicon ' + (i + 1 <= this.state.toColor ? 'glyphicon-star' : 'glyphicon-star-empty')} >
					</i>
				</div>
			)
		}
		return (
			<div>
				{stars}
			</div>
		)
	}
})


module.exports = StarRating;

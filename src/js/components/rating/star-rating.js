import React, {Component} from 'react';

class StarRating extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			rating: props.rating,
			toColor: props.rating
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			rating: nextProps.rating,
			toColor: nextProps.rating
		})
	}

	colorStars(num, e) {
		var event = e.dispatchConfig.registrationName;
		if (this.props.updatable) {
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
		}
	}

	handleClick(num, e) {
		if (this.props.updatable) {
			this.setState({
				rating: num + 1,
				toColor: num + 1
			})
			this.props.updateRating(this.props.name, num + 1);
		}
	}

	render() {
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
}

export default StarRating;

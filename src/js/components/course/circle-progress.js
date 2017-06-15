import React, {Component} from 'react';
import {Circle} from 'progressbar.js';

class CircleProgress extends Component {
	constructor() {
		super();

		this.state = {
			value: 0.0,
			progress: undefined
		};
	}

	componentDidMount() {
		var circle = new Circle('#' + this.props.id, {
			strokeWidth: 6,
			trailWidth: 8,
			duration: 1400,
			color: '#c0392b',
			trailColor: '#ecf0f1',
			easing: 'easeInOut',
			svgStyle: null,
			step: function(state, bar) {
	            bar.setText((bar.value() * 5.0).toFixed(1));
	        }
		});

		circle.text.style.color = '#333';

		this.setState({
			progress: circle
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value && this.state.progress) {
			this.setState({
				value: nextProps.value
			}, function() {
				this.state.progress.animate(nextProps.value / 5.0);
			})
		}
	}

	render() {
		return (
			<div>
				<div className='circle-progress' id={this.props.id}></div>
				{this.props.text}
				<br/><br/>
			</div>
		)
	}
}

export default CircleProgress;
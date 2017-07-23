import React, {Component} from 'react';
import {Line} from 'progressbar.js';

class ProgressBar extends Component {
	componentDidMount() {
		var bar = new Line('#' + this.props.id, {
			strokeWidth: 4,
			easing: 'easeInOut',
			duration: 1400,
			color: '#52a2f1',
			trailColor: '#fff',
			trailWidth: 6,
			svgStyle: {width: '100%', height: '100%'},
			text: {
				style: {
					// Text color.
					// Default: same as stroke color (options.color)
					color: '#333',
					position: 'absolute',
					right: '0',
					padding: 0,
					margin: 0,
					transform: null
				},
				autoStyleContainer: false
			},
			from: {color: '#FFEA82'},
			to: {color: '#ED6A5A'},
			step: function(state, bar) {
				bar.setText((bar.value() * 5.0).toFixed(1));
			}
    	});

    	bar.animate(this.props.rating/5.0);
	}

	render() {
		return (
			<div className='info-custom-progress'>
				<strong>{this.props.title}</strong>
				<i>{this.props.caption}</i>
				<br/>
				<div id={this.props.id}></div>
			</div>
		)
	}
}

export default ProgressBar;
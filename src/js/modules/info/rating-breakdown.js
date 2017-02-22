var React = require('react');
var ReactDOM = require('react-dom');
var BarChart = require('react-chartjs-2').Bar;
var ProgressBar = require('progressbar.js').Line;

var CustomProgress = React.createClass({
	componentDidMount: function() {
		var bar = new ProgressBar('#' + this.props.id, {
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
	},
	render: function() {
		return (
			<div className='custom-progress'>
				<strong>{this.props.title}</strong>
				<i>{', ' + this.props.numResponses + ' responses'}</i>
				<br/>
				<div id={this.props.id}></div>
			</div>
		)
	}
})

var RatingBreakdown = React.createClass({
	getInitialState: function() {
		return {
			average: 0,
			counts: [0,0,0,0,0],
			breakdown: []
		}
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			average: nextProps.average,
			counts: nextProps.counts,
			breakdown: nextProps.breakdown
		})
	},

	getChartInfo: function() {
		var data = {
	        labels: ['1', '2', '3', '4', '5'],
	        datasets: [
	            {
	            	backgroundColor: '#c0392b',
	                borderWidth: 1,
	                data: this.state.counts
	            }
	        ]
	    };

	    var options = {
            responsive: false,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    stacked: false,
                    gridLines: { display: false }
                }],
                yAxes: [{
                    stacked: false,
                    ticks: { 
                        display: false,
                        stepSize: 1
                    }
                }]
            }
        }

        return {data: data, options: options};
	},

	getProgressBars: function() {
		if (!this.state.breakdown || this.state.breakdown.length == 0) {
			return <i>No data to display.</i>
		}

		var bars = [];
		for (var i = 0; i < this.state.breakdown.length; i++) {
			var item = this.state.breakdown[i];
			var id = '' + this.props.id + i;
			bars.push(
				<CustomProgress
					key={id}
					id={id}
					rating={item.average}
					numResponses={item.numResponses}
					title={item.id}
				/>
			)

		}

		return bars;
	},

	render: function() {
		return (
			<div className='breakdown-wrap row'>
				<div className='col-sm-12'>
					<div className='col-md-2 average'>
						<span className='value'>{this.state.average.toFixed(1)}</span>
						<br/>
						{this.props.title}
					</div>
					<div className='col-md-10 breakdown'>
						<div>
							<h4>Total Distribution</h4>
							<p className='small'>{this.props.numResponses + ' responses'}</p>
							<BarChart 
								data={this.getChartInfo().data} 
								options={this.getChartInfo().options}
							/>
						</div>
						<div className='progress-bars'>
							<h4>{this.props.breakdownTitle}</h4>
							{this.getProgressBars()}
						</div>
					</div>
				</div>
			</div>
		)
	}

})

module.exports = RatingBreakdown;
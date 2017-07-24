import React, {Component} from 'react';
import {Bar as BarChart} from 'react-chartjs-2';
import ProgressBar from 'components/progressbar';

class RatingBreakdown extends Component {
	constructor() {
		super();

		this.state = {
			average: 0,
			counts: [0,0,0,0,0],
			breakdown: []
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			average: nextProps.average,
			counts: nextProps.counts,
			breakdown: nextProps.breakdown
		})
	}

	getChartInfo() {
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
	}

	getProgressBars() {
		if (!this.state.breakdown || this.state.breakdown.length == 0) {
			return <i>No data to display.</i>
		}

		var bars = [];
		for (var i = 0; i < this.state.breakdown.length; i++) {
			var item = this.state.breakdown[i];
			var id = '' + this.props.id + i;
			bars.push(
				<ProgressBar
					key={id}
					id={id}
					rating={item.average}
					caption={`, ${item.numResponses} responses`}
					title={item.id}
				/>
			)
		}

		return bars;
	}

	render() {
		return (
			<div className='info-breakdown-wrap row'>
				<div className='col-sm-12'>
					<div className='info-average col-md-2'>
						<span className='info-average-value'>{this.state.average.toFixed(1)}</span>
						<br/>
						{this.props.title}
					</div>
					<div className='info-breakdown col-md-10'>
						<div>
							<h4>Total Distribution</h4>
							<p className='small'>{this.props.numResponses + ' responses'}</p>
							<BarChart 
								data={this.getChartInfo().data} 
								options={this.getChartInfo().options}
							/>
						</div>
						<div className='info-breakdown-progress-bars'>
							<h4>{this.props.breakdownTitle}</h4>
							{this.getProgressBars()}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default RatingBreakdown;
var React = require('react');
var Sensor = require('react-visibility-sensor');
var SimpleSelect = require('react-selectize').SimpleSelect;
var StaticSimpleSelect = require('../static-simple-select.js')

var SearchSummary = React.createClass({
	getInitialState: function() {
		return {
			perPage: 0,
			numResults: 0,
			totalResults: 0,
			numPages: 0,
			currentPage: 1,
			showSummary: false
		}
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			perPage: nextProps.perPage,
			numResults: nextProps.numResults,
			totalResults: nextProps.totalResults,
			numPages: Math.ceil(nextProps.totalResults / nextProps.perPage),
			showSummary: nextProps.showSummary
		});
	},

	handleVisibilityChange: function(visible) {
		this.setState({
			visible: visible
		})
	},

	handlePageChange: function(page) {
		this.setState({
			currentPage: page
		})
		this.props.onPageChange(page);
	},

	handleArrowClick: function(direction) {
		if (direction == 'left' && this.state.currentPage > 1) {
			this.handlePageChange(this.state.currentPage - 1)
		} else if (direction == 'right' && this.state.currentPage < this.state.numPages) {
			this.handlePageChange(this.state.currentPage + 1)
		}
	},

	getPages: function() {
		var pages = [];
		for (var i = 1; i <= this.state.numPages; i++) {
			pages.push(i);
		}

		return pages;
	},

	render: function() {
		var self = this;
		var pagePicker = <StaticSimpleSelect
							default={1}
							options={this.getPages()}
							value={this.state.currentPage}
							onValueChange={this.handlePageChange}
							style={{display: 'inline-block'}}
						 />

		var style = this.state.numResults == 0 ? {display: 'none'} : {};
		var className = this.state.showSummary ? (this.state.visible ? '' : 'fix') : 'hidden';

		
		var placeholderHeight;
		var summaryWrap = document.querySelector('#summaryWrap');
		if (summaryWrap) {
			placeholderHeight = summaryWrap.clientHeight;
		}

		var placeholderStyle = this.state.visible ? {display: 'none'} : {};
		placeholderStyle.height = placeholderHeight;
		console.log(placeholderStyle)
		return (
			<div style={style}>
				<div className='before'></div>
				<Sensor
					scrollCheck={true}
					scrollDelay={50}
					intervalDelay={500}
					partialVisibility={false}
					onChange={this.handleVisibilityChange}
				>
					<div className='sensor-anchor'></div>
				</Sensor>
				<div className='after'></div>
				<div id='summaryWrap' className={'row summary-wrap ' + className}>
					<div className='summary col-sm-4'>
						{'Found ' + this.state.totalResults + ' results, showing ' + this.state.numResults + '.'}
					</div>
					<div className='pages col-sm-8'>
						<a onClick={this.handleArrowClick.bind(this, 'left')}>
							<span className='glyphicon glyphicon-triangle-left' />
						</a>
							Page {pagePicker} of {this.state.numPages}
						<a onClick={this.handleArrowClick.bind(this, 'right')}>
							<span className='glyphicon glyphicon-triangle-right' />
						</a>
					</div>
				</div>
				<div style={placeholderStyle}></div>
			</div>
		)
	}
})


module.exports = SearchSummary;
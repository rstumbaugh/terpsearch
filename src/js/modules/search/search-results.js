var React = require('react');
var ReactSelectize = require('react-selectize');
var VisibilitySensor = require('react-visibility-sensor');
var SearchItem = require('./search-item.js');
var Globals = require('../globals.js');

var SearchResults = React.createClass({
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			results: nextProps.results,
			status: nextProps.status
		});
	},

	getInitialState: function() {
		return {
			status: 'waiting',
			results: []
		}
	},
	
	getSearchItems: function() {
		if (this.state.results.length == 0) {
			return <div><i>No results to display.</i></div>;
		}

		var items = [];

		for (var i = 0; i < this.state.results.length; i++) {
			var course = this.state.results[i];
			items.push(
				<SearchItem key={i}
							course_id={course.course_id}
							title={course.name}
							description={course.description}
							gen_ed={course.gen_ed.join(', ') || 'None'}
							credits={course.credits}
							lastOffered={Globals.getSemesterFromCode(course.semester)}
							diffRating={course.avg_diff ? course.avg_diff.toFixed(1) : 'N/A'}
							intRating={course.avg_int ? course.avg_int.toFixed(1) : 'N/A'}
							link='#'
							hasReviews={course.num_responses > 0}
				/>
			)
		}

		return items;
	},

	render: function() {
		var results;

		if (this.state.status == 'done' || this.state.status == 'waiting') {
			results = this.getSearchItems();

		} else if (this.state.status == 'loading') {
			results = <div><i>Loading...</i></div>;
		}
		
		return (
			<div>
				{results}
			</div>
		)
	}
	
})


module.exports = SearchResults;
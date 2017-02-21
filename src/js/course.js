var React = require('react');
var ReactDOM = require('react-dom');
var CircleProgress = require('./modules/circle-progress.js');
var CourseInfo = require('./modules/course-info.js');
var RatingBreakdown = require('./modules/rating-breakdown.js');
var CourseComments = require('./modules/course-comments.js');
var CommentInput = require('./modules/comment-input.js');
var RatingForm = require('./modules/rating-form.js');
var Header = require('./modules/header.js');
var Footer = require('./modules/footer.js');
var Globals = require('./modules/globals.js');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var App = React.createClass({
	getInitialState: function() {
		return {
			courseInfo: {},
			courseStats: {},
			courseId: Globals.getQueryString().course_id,
			comments: [],
			status: 'waiting'
		}
	},

	componentDidMount: function() {
		this.loadCourseInformation()
			.then(this.loadStatsComments)
			.catch(function(err) {
				console.log(err)
			})
	},

	loadCourseInformation: function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			fetch(Globals.API_COURSES + '?course_id=' + self.state.courseId)
				.then(Globals.handleFetchResponse)
				.then(function(response) {
					self.setState({
						courseInfo: response[1][0]
					});
					console.log('loaded course info');
					resolve();
				})
			
		})
	},

	loadStatsComments: function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			fetch(Globals.API_COURSE_STATS + '?course_id=' + self.state.courseId)
				.then(Globals.handleFetchResponse)
				.then(function(response) {
					self.setState({
						comments: response.comments,
						courseStats: {
							profs: response.profs,
							diffCounts: response.diffCounts,
							intCounts: response.intCounts,
							avgDiff: response.totalDiffAvg,
							avgInt: response.totalIntAvg,
							numResponses: response.totalCount
						}
					}, function() {
						console.log('loaded stats and comments');
						resolve()
					})
					
				})
		})
	},

	getRequestBody: function(comment) {
		return {
			comment: comment.text,
			name: comment.name,
			course_id: this.state.courseId
		}
	},

	render: function() {
		var diffStats = {
			average: 0,
			counts: [0,0,0,0,0],
			numResponses: 0,
			breakdown: []
		};
		var intStats = {
			average: 0,
			counts: [0,0,0,0,0],
			numResponses: 0,
			breakdown: []
		};

		if (Object.keys(this.state.courseStats).length) {
			var stats = this.state.courseStats;
			var diffs = [];
			var ints = [];

			for (var i = 0; i < stats.profs.length; i++) {
				diffs.push({
					average: stats.profs[i].diffAvg,
					numResponses: stats.profs[i].numResponses,
					id: stats.profs[i].name
				});

				ints.push({
					average: stats.profs[i].intAvg,
					numResponses: stats.profs[i].numResponses,
					id: stats.profs[i].name
				});
			}

			diffStats = {
				average: stats.avgDiff,
				counts: stats.diffCounts,
				numResponses: stats.numResponses,
				breakdown: diffs
			};

			intStats = {
				average: stats.avgInt,
				counts: stats.intCounts,
				numResponses: stats.numResponses,
				breakdown: ints
			};
		}

		return (
			<div>
				<Header />
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-sm-10 col-sm-offset-1'>
							<div className='col-md-9'>
								<CourseInfo course={this.state.courseInfo} />
							</div>
							<div className='col-md-3'>
								<div className='circle-progress-wrap col-sm-6 col-md-12'>
									<CircleProgress 
										id='circleDiff'
										text='Average Difficulty' 
										value={this.state.courseInfo.avg_diff}
									/>
								</div>
								<div className='circle-progress-wrap col-sm-6 col-md-12'>
									<CircleProgress 
										id='circleInt'
										text='Average Interest'
										value={this.state.courseInfo.avg_int} 
									/>
								</div>
							</div>
							<div className='col-md-12'>
								<RatingBreakdown
									title='Average Difficulty'
									breakdownTitle='Professor Breakdown'
									average={diffStats.average}
									numResponses={diffStats.numResponses}
									counts={diffStats.counts}
									breakdown={diffStats.breakdown}
								/>
							</div>
							<div className='col-md-12'>
								<RatingBreakdown
									title='Average Interest'
									breakdownTitle='Professor Breakdown'
									average={intStats.average}
									numResponses={intStats.numResponses}
									counts={intStats.counts}
									breakdown={intStats.breakdown}
								/>
							</div>
							<div className='col-md-12'>
								<CourseComments 
									comments={this.state.comments} 
								/>
							</div>
							<div className='col-md-7'>
								<CommentInput
									rows={6}
									minLength={25}
									id={this.state.courseId}
									getRequestBody={this.getRequestBody}
								/>
							</div>
							<div className='col-md-5'>
								<RatingForm />
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
})

ReactDOM.render(<App />, document.getElementById('app'))
import React, {Component} from 'react';

import CourseInfo from 'components/info/course-info.js';
import CircleProgress from 'components/info/circle-progress.js';
import RatingBreakdown from 'components/info/rating-breakdown.js';
import Comments from 'components/info/info-comments.js';
import CommentInput from 'components/info/comment-input.js';
import RatingForm from 'components/rating/rating-form.js';
import Breadcrumb from 'components/breadcrumb';
import Ajax from 'utils/ajax';

import {Header, Content, Footer} from 'utils/layout.js';
import Globals from 'globals';

class Course extends Component {
	constructor(props) {
		super(props);

		this.state = {
			courseInfo: {},
			courseStats: {},
			courseId: props.match.params.courseId,
			comments: [],
			status: 'waiting',
			from: props.location.state ? props.location.state.from : ''
		}
	}

	componentDidMount() {
		var self = this;

		Promise.all([this.loadCourseInformation(), this.loadStatsComments()])
			.then(response => {
				var courseInfo = response[0];
				var statsComments = response[1];

				self.setState({
					courseInfo: courseInfo,
					comments: statsComments.comments,
					courseStats: {
						profs: statsComments.profs,
						diffCounts: statsComments.diffCounts,
						intCounts: statsComments.intCounts,
						avgDiff: statsComments.totalDiffAvg,
						avgInt: statsComments.totalIntAvg,
						numResponses: statsComments.totalCount
					}
				})
			})
			.catch(function(err) {
				console.error(err);
			})
	}

	loadCourseInformation() {
		return Ajax.get(Globals.API_COURSES + '?course_id=' + this.state.courseId)
				.then(res => JSON.parse(res.response))
				.then(function(response) {
					return response[1][0]
				})
				.catch(err => {
					console.error(err);
				})
	}

	loadStatsComments() {
		return Ajax.get(Globals.API_COURSE_STATS + '?course_id=' + this.state.courseId)
				.then(res => JSON.parse(res.response))
				.catch(err => {
					console.error(err);
				})
	}

	getRequestBody(comment) {
		return {
			comment: comment.text,
			name: comment.name,
			course_id: this.state.courseId
		}
	}

	render() {
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
				<Content offset>
					<Breadcrumb from={this.state.from} />
					<div className='row card'>
						<div className='col-md-9'>
							<CourseInfo 
								course={this.state.courseInfo}
							/>
						</div>
						<div className='col-md-3'>
							<div className='col-sm-6 col-md-12'>
								<CircleProgress 
									id='circleDiff'
									text='Average Difficulty' 
									value={this.state.courseStats.avgDiff}
								/>
							</div>
							<div className='col-sm-6 col-md-12'>
								<CircleProgress 
									id='circleInt'
									text='Average Interest'
									value={this.state.courseStats.avgInt} 
								/>
							</div>
						</div>
					</div>
					<div className='row card'>
						<div className='col-md-12'>
							<RatingBreakdown
								title='Average Difficulty'
								breakdownTitle='Professor Breakdown'
								average={diffStats.average}
								numResponses={diffStats.numResponses}
								counts={diffStats.counts}
								breakdown={diffStats.breakdown}
								id='diffBkdwn'
							/>
						</div>
					</div>
					<div className='row card'>
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
					</div>
					<div className='row card'>
						<div className='col-md-12'>
							<Comments 
								max={5}
								id={this.state.courseId}
								type='course'
								comments={this.state.comments} 
							/>
						</div>

						<div className='col-md-7'>
							<CommentInput
								rows={6}
								minLength={25}
								id={this.state.courseId}
								getRequestBody={this.getRequestBody.bind(this)}
							/>
						</div>
						<div className='col-md-5'>
							<RatingForm />
						</div>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default Course;
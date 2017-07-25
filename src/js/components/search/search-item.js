import React, {Component} from 'react';
import Link from 'components/link';

class SearchItem extends Component {
	render() {
    var noReviewsPanel = 
      this.props.hasReviews 
        ? undefined 
        : <div className="col-xs-12">
            <div className="panel panel-warning">
              <div className="panel-heading">No reviews found.</div>
            </div>
          </div>;               
		
    return (
			<div className='search-result card row'>
        <div className='col-sm-3 col-md-2'>
        	<h2>
            <Link to={`/course/${this.props.course_id}`} pushHistory>
              {this.props.course_id}
            </Link>
          </h2>
          <div className='search-result-rating col-xs-6'>
            <span className='large'>{this.props.diffRating}</span><br/>
            Avg. Difficulty
          </div>
          <div className='search-result-rating col-xs-6'>
            <span className='large'>{this.props.intRating}</span><br/>
            Avg. Interest
          </div>
          {noReviewsPanel}
        </div>
        <div className='col-sm-9 col-md-10'>
          <h3>
            <Link to={`/course/${this.props.course_id}`} pushHistory>
              {this.props.title}
            </Link>
          </h3>
          <div className='search-result-info row'>
            <div className='col-sm-4'>
              <strong>Last offered: </strong><span className='semester'>{this.props.lastOffered}</span>
            </div>
            <div className='col-sm-4'>
              <strong>Gen Ed: </strong><span className='gen_ed'>{this.props.gen_ed}</span>
            </div>
            <div className='col-sm-4'>
              <strong>Credits: </strong><span className='credits'>{this.props.credits}</span>
            </div>
            <div className='clearfix visible-sm'></div>
          </div>
          <div className='search-result-description'>
            <div className='col-sm-12'>
              {this.props.description || <i>No description.</i>}
            </div>
          </div>
        </div>
      </div>
		)
	}
}

export default SearchItem;
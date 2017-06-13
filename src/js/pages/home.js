import styles from 'styles/home.scss';
import scheduleImg from 'images/schedule.png';
import shellImg from 'images/shell.svg';
import classImg from 'images/class.svg';
import capImg from 'images/students-cap.svg';
import searchImg from 'images/search.svg';
import ratingImg from 'images/ratings.svg';
import descImg from 'images/desc.svg';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import Search from 'pages/search.js';
import Header from 'components/header.js';

class Home extends React.Component {
  render() {
    return (
      <div className='row'>
        <Header white />
  			<div className='container-fluid home-wrap'>
  				<div className='row landing'>
  					<div className='hero-wrap col-md-5 col-md-offset-1'>
  						<div className='hero'>
  							<h1>Course selection <br/> made simple.</h1>
  							<br/>
                <Link to='/search' className='btn btn-lg btn-primary'>Start Searching</Link>
  						</div>
  						<div className='subtitle'>
  							<h2><i>Made for Terps, by Terps.</i></h2>
  						</div>
  					</div>
  					<div className='img-wrap col-md-5 hidden-xs hidden-sm'>
  						<img className='col-sm-12' src={scheduleImg} />
  					</div>
  				</div>

  				<div className='row icons'>
	          <div className='col-sm-12 col-md-10 col-md-offset-1'>
              <div className='icon-wrap col-sm-12 col-md-4'>
                <img src={shellImg} />
                <p>One of the only course selection applications made specifically for UMD students.</p>
              </div>
              <div className='icon-wrap col-sm-12 col-md-4'>
                <img src={classImg} />
                <p>Find and filter classes based on difficulty, Gen Ed requirements, engagement, and subject.</p>
              </div>
              <div className='icon-wrap col-sm-12 col-md-4'>
                <img src={capImg} />
                <p>Course information contributed by University of Maryland students just like you.</p>
              </div>
	          </div>
          </div>
          
          <div className='row content'>
            <div className='content-heading'>
            	Features
            </div>
            <div className='col-sm-12'>
              <div className='content-list card'>
                <div className='row content-item'>
                  <div className='col-md-1 hidden-sm hidden-xs'>
                  	<img src={searchImg} alt='search.svg' width='100%' />
                  </div>
                  <div className='content-desc col-md-11'>
                    <h2>Powerful course searching</h2>
                    It's never been easier to find courses that fit your interests. With the ability to search for 
                    courses by keyword, professor, difficulty, interest, and more, you'll be sure to find courses 
                    that fit your needs.
                  </div>
                </div>
                <div className='row content-item'>
                  <div className='col-md-1 hidden-sm hidden-xs'>
                    <img src={ratingImg} alt='ratings.svg' width='100%' />
                  </div>
                  <div className='content-desc col-md-11'>
                    <h2>Student-contributed ratings and reviews</h2>
                    Powered by ratings provided by UMD students, you can see what other students think about the 
                    courses you're considering. See what students thought about both the difficulty and interest of 
                    courses, as well as rating breakdowns by professor.
                  </div>
                </div>
                <div className='row content-item'>
                    <div className='col-md-1 hidden-sm hidden-xs'>
                      <img src={descImg} alt='desc.svg' width='100%' />
                    </div>
                    <div className='content-desc col-md-11'>
                      <h2>In-depth descriptions</h2>
                      Course information and description is retrieved from the University of Maryland Schedule of 
                      Classes, so you can be sure that you have the most accurate and up-to-date course information 
                      available.
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row coming-soon content'>
              <div className='content-heading'>
                  More coming soon
              </div>
              <div className='col-sm-12'>
                <div className='content-list card'>
                  <div className='row content-item'>
                    <div className='col-md-6 coming-soon-content'>
                      <p>
                        You can check out the code and progress <a href='https://github.com/rstumbaugh/terpsearch' 
                        target='_blank'>here</a> on GitHub.
                        In the meantime, contribute your own ratings to help out!<br/><br />

                        Feel free to <a href='mailto:admin@terpsearch.me' target='_blank'>shoot me an email</a> 
                        with any suggestions you might have for the site or 
                        <a href='https://github.com/rstumbaugh/terpsearch/issues' target='_blank'>report an issue 
                        on GitHub</a>. Some possible features on the To Do list include:
                        <br/>
                      </p>
                      <ul className='coming-soon-list'>
                        <li>
                          <h3>Facebook integration</h3>
                          See courses your Facebook friends have taken and how they have rated them in the past.
                        </li>
                        <li>
                          <h3>Professor review pages</h3>
                          See all ratings for courses taught by a specific professor and leave comments and reviews.
                        </li>
                        <li>
                          <h3>Course suggestions</h3>
                          Given your remaining unfulfilled requirements and interests, find and suggest courses 
                          to fit your schedule.
                        </li>
                      </ul>
                    </div>
                    <div className='col-md-6 rating-wrap'>
                      <div id='ratingForm' className='form-wrap col-sm-12'></div>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          
          <div className='row feedback'>
            <div className='col-sm-12 col-md-10 col-md-offset-1'>
              <h2>Questions? Comments? Suggestions?</h2>
              <p>
                Have any feedback about the site or idea? Maybe a cool idea you'd like to see? Feel free to leave an 
                anonymous comment here. Comments, complaints, and suggestions are welcome.
              </p>
              <div id='feedback'></div>
            </div>
          </div>
          
          <div className='row content'>
            <div className='content-heading'>
              Changelog
            </div>
            <div className='col-sm-12'>
              <div className='content-list card'>
                <div className='row content-item'>
                  <div className='col-sm-12'>
                    <h3 className='version-title'>v1.0</h3>
                    <p className='version-desc'>
                      The first version of TerpSearch is out! This first version features advanced course searching, 
                      student-contributed ratings and reviews, and course information retrieved from Testudo. Excited 
                      to see where this will go in the future!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        	<div id='footer'></div>
  			</div>
      </div>
    )
  }
}

export default Home;

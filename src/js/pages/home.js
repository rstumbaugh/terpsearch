import scheduleImg from 'images/schedule.png';
import shellImg from 'images/shell.svg';
import classImg from 'images/class.svg';
import capImg from 'images/students-cap.svg';
import searchImg from 'images/search.svg';
import ratingImg from 'images/ratings.svg';
import descImg from 'images/desc.svg';

import React from 'react';
import {Link} from 'react-router-dom';

import {Header, Content, Footer} from 'utils/layout.js';
import History from 'utils/history';
import RatingForm from 'components/rating/rating-form.js';
import Feedback from 'components/feedback.js';
import Changelog from 'components/home/changelog';
import ChangelogItem from 'components/home/changelog-item';

class Home extends React.Component {
  componentDidMount() {
    History.clear();
  }

  render() {
    return (
      <div>
        <Header white />
        <Content noDisclaimer>
          <div className='home-wrap'>
            <div className='home-landing row'>
              <div className='home-hero-wrap col-md-5 col-md-offset-1'>
                <div className='home-hero'>
                  <h1>Course selection <br/> made simple.</h1>
                  <br/>
                  <Link to='/search' className='btn-blue large'>Start Searching</Link>
                </div>
                <div className='home-hero-subtitle'>
                  <h2><i>Made by Terps, for Terps</i></h2>
                </div>
              </div>
              <div className='home-img col-md-5 hidden-xs hidden-sm'>
                <img className='col-sm-12' src={scheduleImg} />
              </div>
            </div>

            <div className='home-icon-list row'>
              <div className='col-sm-12 col-md-10 col-md-offset-1'>
                <div className='home-icon-wrap col-sm-12 col-md-4'>
                  <img src={shellImg} />
                  <p>One of the only course selection applications made specifically for UMD students.</p>
                </div>
                <div className='home-icon-wrap col-sm-12 col-md-4'>
                  <img src={classImg} />
                  <p>Find and filter classes based on difficulty, Gen Ed requirements, engagement, and subject.</p>
                </div>
                <div className='home-icon-wrap col-sm-12 col-md-4'>
                  <img src={capImg} />
                  <p>Course information contributed by University of Maryland students just like you.</p>
                </div>
              </div>
            </div>

            <div className='home-content-wrap row'>
              <div className='home-content-heading'>
                Features
              </div>
              <div className='col-md-10 col-md-offset-1'>
                <div className='card'>
                  <div className='home-content-item row'>
                    <div className='col-md-1 hidden-xs hidden-sm'>
                      <img src={searchImg} alt='search.svg' className='home-content-img' />
                    </div>
                    <div className='home-content-desc col-md-11'>
                      <h2 className='home-content-title'>Powerful course searching</h2>
                      <p>
                        It's never been easier to find courses that fit your interests. With the ability to search for 
                        courses by keyword, professor, difficulty, interest, and more, you'll be sure to find courses 
                        that fit your needs.
                      </p>
                    </div>
                  </div>
                  <div className='home-content-item row'>
                    <div className='col-md-1 hidden-xs hidden-sm'>
                      <img src={ratingImg} alt='search.svg' className='home-content-img' />
                    </div>
                    <div className='home-content-desc col-md-11'>
                      <h2 className='home-content-title'>Student-contributed ratings and reviews</h2>
                      <p>
                        Powered by ratings provided by UMD students, you can see what other students think about the 
                        courses you're considering. See what students thought about both the difficulty and interest of 
                        courses, as well as rating breakdowns by professor.
                      </p>
                    </div>
                  </div>
                  <div className='home-content-item row'>
                    <div className='col-md-1 hidden-xs hidden-sm'>
                      <img src={descImg} alt='search.svg' className='home-content-img' />
                    </div>
                    <div className='home-content-desc col-md-11'>
                      <h2 className='home-content-title'>In-depth descriptions</h2>
                      <p>
                        Course information and description is retrieved from the University of Maryland Schedule of 
                        Classes, so you can be sure that you have the most accurate and up-to-date course information 
                        available.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='home-content-wrap row'>
              <div className='home-content-heading'>
                About TerpSearch
              </div>
              <div className='col-md-10 col-md-offset-1'>
                <div className='card'>
                  <div className='row home-content-item'>
                    <div className='col-md-6 home-coming-soon'>
                      <p>
                        TerpSearch is a <a href='https://rstumbaugh.me/' target='_blank'>student-created</a> website
                        aiming to help University of Maryland students find interesting courses for their 
                        schedule. We are very open to feedback and accept any and all input!<br/><br/>

                        You can check out the code and progress <a href='https://github.com/rstumbaugh/terpsearch' 
                        target='_blank'>here</a> on GitHub.
                        In the meantime, contribute your own ratings to help out!<br/><br />

                        Feel free to <a href='mailto:admin@terpsearch.me' target='_blank'>shoot me an email</a> with 
                        any suggestions you might have for the site or <a href='https://github.com/rstumbaugh/terpsearch/issues' target='_blank'>report an issue 
                        on GitHub</a>. Some possible features on the To Do list include:
                        <br/>
                      </p>
                      <ul>
                        <li>
                          <h3>More powerful Facebook integration</h3>
                          <p>See if friends have taken a course right from the Search Results page.</p>
                        </li>
                        <li>
                          <h3>Professor review pages</h3>
                          <p>See all ratings for courses taught by a specific professor and leave comments.</p>
                        </li>
                        <li>
                          <h3>Course suggestions</h3>
                          <p>
                            Given your remaining unfulfilled requirements and interests, find and suggest courses 
                            to fit your schedule.
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className='col-md-5 col-md-offset-1'>
                      <RatingForm history={this.props.history} />
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className='home-feedback row'>
              <div className='col-md-10 col-md-offset-1'>
                <h2>Feedback</h2>
                <p>
                  Have any feedback about the site or idea? Maybe a cool idea you'd like to see? Feel free to leave an 
                  anonymous comment here. Comments, complaints, and suggestions are welcome.
                </p>
                <Feedback />
              </div>
            </div>

            <Changelog>
              <ChangelogItem
                version='1.3'
                date='November 2017'
                description={
                  'Completed Profile page using Facebook login. Users can now view their ' +
                  'Facebook friends that are on TerpSearch as well as courses they have taken, ' +
                  'ratings they have left, and comments they have added. Users have the option ' +
                  'hide their profile as well. <i>Only name and friends list is collected from ' +
                  'Facebook. No other information is used or stored.</i> '
                }
              />
              <ChangelogItem
                version='1.2'
                date='July 2017'
                description={
                  'Added Facebook login and UMD authentication. UMD login assures that all ' +
                  'contributors will be UMD students, and Facebook login sets the groundwork for ' +
                  'finding courses your friends have taken and seeing your friends ratings, reviews ' +
                  'and comments! Don\'t worry, when this feature is released, we will give you the ' +
                  'ability to hide your profile or certain reviews you\'d like to keep private.'
                }
              />
              <ChangelogItem
                version='1.1'
                date='June 2017'
                description={
                  'Lots of behind the scenes fixes -- almost a complete refactoring of most of ' +
                  'TerpSearch\'s code. New fixes include saving your search so the results don\'t ' +
                  'disappear when changing pages.'
                }
              />
              <ChangelogItem
                version='1.0'
                date='April 2017'
                description={
                  'The first version of TerpSearch is out! This first version features advanced ' +
                  'course searching, student-contributed ratings and reviews, and course ' +
                  'information retrieved from Testudo. Excited to see where this will go in the future!'
                }
              />
            </Changelog>
          </div>
        </Content>
        <Footer />
      </div>
    )
  }
}

export default Home;

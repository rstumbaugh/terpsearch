const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    admin: './js/admin.js',
    comments: './js/comments.js',
    course: './js/course.js',
    feedback: './js/feedback.js',
    home: './js/home.js',
    professor: './js/professor.js',
    rate: './js/rate.js',
    search: './js/search.js',
  },
  output: {
    path: path.resolve(__dirname, './build/src'),
    filename: '[name].build.js'
  },
}; 

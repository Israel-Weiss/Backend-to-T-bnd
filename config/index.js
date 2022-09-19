var config;

console.log('print env', process.env)
if (process.env.NODE_ENV === 'production') {
  config = require('./prod')
} else {
  config = require('./dev')
}

module.exports = config
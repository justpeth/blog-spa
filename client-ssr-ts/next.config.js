const withStylus = require('@zeit/next-stylus');

const newConfig = {
  webpack: config => {
    config.node = {
      fs: 'empty'
    }

    return config
  }
};
module.exports = withStylus(newConfig)
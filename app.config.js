const appJson = require('./app.json');

module.exports = {
  ...appJson.expo,
  ios: {
    ...appJson.expo.ios,
    bundleIdentifier: appJson.expo.ios?.bundleIdentifier ?? 'com.ajith14.draftbitmapapp',
  },
  android: {
    ...appJson.expo.android,
  },
};

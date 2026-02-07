const { withGradleProperties } = require('@expo/config-plugins');

const withAndroidNdkFix = (config) => {
  return withGradleProperties(config, (config) => {
    config.modResults.push({
      type: 'property',
      key: 'android.ndkVersion',
      value: '26.1.10909125',
    });
    return config;
  });
};

module.exports = withAndroidNdkFix;

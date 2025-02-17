const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = { resetCache:true};
 
// Add this wrapper for Reanimated
const reanimatedConfig = wrapWithReanimatedMetroConfig(config);

module.exports = mergeConfig(
  getDefaultConfig(__dirname), 
  reanimatedConfig
);
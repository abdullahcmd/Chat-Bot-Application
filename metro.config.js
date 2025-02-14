// Import Metro's recommended config
const { getDefaultConfig } = require('@react-native/metro-config');
// Import Reanimated Metro config
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Ensure asset extensions are correctly handled
defaultConfig.resolver.assetExts.push('ttf', 'png', 'jpg', 'jpeg', 'gif');

// Apply Reanimated Metro config
module.exports = wrapWithReanimatedMetroConfig(defaultConfig);

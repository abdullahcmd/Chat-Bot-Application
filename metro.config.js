// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const reanimated = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const {assetExts, sourceExts} = defaultConfig.resolver;

// Custom SVG transformer config
const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

const mergedConfig = mergeConfig(defaultConfig, customConfig);

module.exports = reanimated.wrapWithReanimatedMetroConfig(mergedConfig);

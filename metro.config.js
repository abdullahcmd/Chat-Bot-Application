const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Custom configuration for SVG + Reanimated
 */
const customConfig = {
  // Optional: Force Metro to reset its cache on every run
  resetCache: true,

  transformer: {
    // Point to the react-native-svg-transformer
    babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
  },
  resolver: {
    // Exclude "svg" from assetExts
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    // Add "svg" to sourceExts
    sourceExts: [...sourceExts, 'svg'],
  },
};

// Merge our custom config with the default config
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// Finally, wrap the merged config with Reanimated
const finalConfig = wrapWithReanimatedMetroConfig(mergedConfig);

module.exports = finalConfig;

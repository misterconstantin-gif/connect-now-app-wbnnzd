
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({ root: path.join(__dirname, 'node_modules', '.cache', 'metro') }),
];

// Ensure proper resolution of modules
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

// Add support for additional file extensions
config.resolver.sourceExts.push('cjs');

module.exports = config;

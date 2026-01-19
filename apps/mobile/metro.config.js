const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Watch the core package folder
config.watchFolders = [
  path.resolve(__dirname, '../../packages/core')
];

// Make Metro resolve node_modules in root and packages/core
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
  path.resolve(__dirname, '../../packages/core/node_modules')
];

module.exports = config;

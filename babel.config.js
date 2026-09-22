module.exports = function(api) {
  api.cache(true);
  return {
    babelrc: false,
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel']
  };
};

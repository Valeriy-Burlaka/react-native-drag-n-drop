module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./app'],
          extensions: [
            '.js',
            '.ts',
            '.tsx',
          ],
        }
      ],
      'react-native-reanimated/plugin',
    ]
  };
};

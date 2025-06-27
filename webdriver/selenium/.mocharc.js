module.exports = {
  timeout: 120000, // 2 minutes timeout for all tests
  slow: 5000, // Tests taking longer than 5 seconds are considered slow
  ui: 'bdd', // Behavior Driven Development interface
  reporter: 'spec', // Detailed spec reporter
  recursive: true, // Run tests recursively in subdirectories
  extension: ['js'], // Only run .js files
  ignore: ['node_modules/**'], // Ignore node_modules
  watch: false, // Don't watch by default
  'watch-files': ['test/**/*.js'], // Files to watch when in watch mode
  'watch-ignore': ['node_modules/**'], // Files to ignore when watching
  bail: false, // Don't bail on first failure
  'full-trace': true, // Show full stack traces
  'inline-diffs': true, // Show inline diffs for failed assertions
  colors: true, // Enable colors in output
  'reporter-option': [
    'spec=-',
    'dot=-',
    'nyan=-'
  ]
}; 
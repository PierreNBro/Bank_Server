const merge = require('merge')
const ts_preset = require('ts-jest/jest-preset')
const mongo_preset = require('@shelf/jest-mongodb/jest-preset');
 
module.exports = merge.recursive(ts_preset, mongo_preset, {
  testEnvironment: 'node',
  collectCoverage: true
});
// module.exports = {
//   roots: ['src'],
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   collectCoverage: true
// };

// Old setup
// module.exports = {
//   "roots": [
//     "<rootDir>/src"
//   ],
//   "testMatch": [
//     "**/__tests__/**/*.+(ts|tsx|js)",
//     "**/?(*.)+(spec|test).+(ts|tsx|js)"
//   ],
//   "transform": {
//     "^.+\\.(ts|tsx)$": "ts-jest"
//   },
// }
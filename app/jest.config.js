/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '\\.css$': '<rootDir>/test/css_mock.js',
    },
    roots: ['src', 'test'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    testEnvironment: '<rootDir>/test/environment.ts',
};

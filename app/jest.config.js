/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '\\.css$': '<rootDir>/test/cssMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    testEnvironment: '<rootDir>/test/environment.ts',
};

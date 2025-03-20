module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1"  // Add this line for path alias if needed
    },
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        "/node_modules/(?!react-router|react-router-dom/).+\\.js$"
    ],
    testPathIgnorePatterns: ["/node_modules/", "/build/"],
    verbose: true
};
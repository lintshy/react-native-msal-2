module.exports = {
    preset: 'react-native',
    "setupFiles": [
        "./jest-setup.js"
    ],
    "transformIgnorePatterns": [
        "node_modules/(?!((jest-)?react-native|@react-native|react-native-msal/.*))"
    ],
    modulePathIgnorePatterns: ["./src/Config/"]
}
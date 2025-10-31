module.exports = {
  expo: {
    name: 'DrinkRats',
    slug: 'drinkrats',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0D0805',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.drinkrats.app',
      newArchEnabled: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0D0805',
      },
      package: 'com.drinkrats.app',
      newArchEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-router'],
    scheme: 'drinkrats',
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://10.0.2.2:3000',
      useMockData: process.env.USE_MOCK_DATA || 'false',
    },
  },
};

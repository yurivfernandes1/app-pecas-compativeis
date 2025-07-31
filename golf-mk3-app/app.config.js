export default {
  expo: {
    name: 'Golf MK3 - Peças Compatíveis',
    slug: 'golf-mk3-pecas-compativeis',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.falandodegti.golfmk3',
      buildNumber: '1.0.0',
      infoPlist: {
        NSCameraUsageDescription: 'Este app não usa a câmera',
        NSMicrophoneUsageDescription: 'Este app não usa o microfone',
        NSLocationWhenInUseUsageDescription: 'Este app não usa localização'
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      package: 'com.falandodegti.golfmk3',
      versionCode: 1,
      permissions: []
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
      output: 'static',
      build: {
        babel: {
          include: ['@expo/vector-icons']
        }
      }
    },
    plugins: [
      'expo-router'
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: 'your-project-id-here'
      }
    },
    owner: 'falandodegti'
  }
};
import crashlytics from '@react-native-firebase/crashlytics';

// Initialize Crashlytics
export const initializeCrashlytics = () => {
  crashlytics().setCrashlyticsCollectionEnabled(true);
};

// Log a non-fatal error
export const logError = (errorName, message = '', stackTrace = []) => {
  crashlytics().recordError(errorName, message, stackTrace);
};

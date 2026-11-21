import type { ConfigContext, ExpoConfig } from 'expo/config';

// Extends app.json. The Google Maps iOS key is read from the environment at
// build time (a GitHub Actions secret), so it's never stored in the repo.
// Without a key, the react-native-maps plugin isn't added, Google Maps isn't
// linked, and the Map tab shows a "not configured" state instead of crashing.
export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsKey = process.env.GOOGLE_MAPS_IOS_API_KEY?.trim();

  return {
    ...config,
    name: config.name ?? 'Road Monitor',
    slug: config.slug ?? 'road-monitor',
    plugins: [
      ...(config.plugins ?? []),
      ...(googleMapsKey
        ? ([['react-native-maps', { iosGoogleMapsApiKey: googleMapsKey }]] as ExpoConfig['plugins'] & object)
        : []),
    ],
    extra: {
      ...config.extra,
      googleMapsEnabled: Boolean(googleMapsKey),
    },
  };
};

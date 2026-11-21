import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

// Placeholder screen used to confirm the build → install pipeline works
// (GitHub Actions IPA/APK → Sideloadly / Android install).
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Road Monitor</Text>
      <Text style={styles.subtitle}>AI road condition monitoring (FYP)</Text>
      <Text style={styles.meta}>
        Setup build · {Platform.OS} {String(Platform.Version)}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, marginTop: 8, color: '#444' },
  meta: { fontSize: 13, marginTop: 24, color: '#888' },
});

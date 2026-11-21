import { color } from '../theme';

/** Shared native-stack header look for every tab's stack. */
export const stackScreenOptions = {
  headerLargeTitle: true,
  headerLargeTitleShadowVisible: false,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: color.bg },
  headerLargeStyle: { backgroundColor: color.bg },
  headerTitleStyle: { color: color.text },
  headerLargeTitleStyle: { color: color.text },
  headerTintColor: color.accent,
  contentStyle: { backgroundColor: color.bg },
} as const;

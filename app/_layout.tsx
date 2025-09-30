
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import { Button } from "@/components/button";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import { useFonts } from "expo-font";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <SystemBars style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="chat/[id]" 
            options={{ 
              headerShown: false,
              presentation: 'card',
            }} 
          />
          <Stack.Screen 
            name="video-call/[id]" 
            options={{ 
              headerShown: false,
              presentation: 'fullScreenModal',
            }} 
          />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

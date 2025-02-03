import { View, Text } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack, Slot } from "expo-router";

const ScreensLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="lesson/lesson" options={{ headerShown: false }} />
        <Stack.Screen name="grammar" options={{ headerShown: false }} />
        <Stack.Screen name="ads" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="listen" options={{ headerShown: false }} />
        <Stack.Screen name="exercise" options={{ headerShown: false }} />
        <Stack.Screen name="success" options={{ headerShown: false }} />
        <Stack.Screen name="subscription" options={{ headerShown: false }} />
        <Stack.Screen name="response" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
        <Stack.Screen name="terms" options={{ headerShown: false }} />
        <Stack.Screen name="setting" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: false }} />

        <Stack.Screen
          name="vocabulary/vocabulary"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="dark" />
    </>
  );
};

export default ScreensLayout;

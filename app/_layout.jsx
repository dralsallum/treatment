// RooyLayout.js
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import { NotificationProvider } from "./redux/NotificationContext";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { setUser } from "./redux/authSlice";

import { ActivityIndicator, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function RootProvider({ children }) {
  const [isRehydrating, setIsRehydrating] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  // RooyLayout.js
  useEffect(() => {
    const rehydrateUser = async () => {
      try {
        const storedRefreshToken = await SecureStore.getItemAsync(
          "refreshToken"
        );
        if (storedRefreshToken) {
          // Attempt to refresh
          const res = await fetch(
            "https://quizeng-022517ad949b.herokuapp.com/api/auth/refresh",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: storedRefreshToken }),
            }
          );
          if (!res.ok) throw new Error("Refresh token invalid/expired");

          const data = await res.json();

          const newUser = {
            ...data,
            refreshToken: storedRefreshToken,
          };

          dispatch(setUser(newUser));
        }
      } catch (err) {
        console.log("Rehydrate user error:", err);
      } finally {
        setIsRehydrating(false);
      }
    };

    rehydrateUser();
  }, [dispatch]);

  if (isRehydrating) {
    // Show a quick loading screen while we check token
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4c47e8" />
      </View>
    );
  }

  // Once done rehydrating, we render children => The Stack
  return <>{children}</>;
}

const RooyLayout = () => {
  return (
    <Provider store={store}>
      <NotificationProvider>
        {/* RootProvider handles rehydration & appsFlyer initialization */}
        <RootProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="components/streak"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
          </Stack>
        </RootProvider>
      </NotificationProvider>
    </Provider>
  );
};

export default RooyLayout;

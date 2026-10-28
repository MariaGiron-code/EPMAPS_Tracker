import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { queryClient } from "../src/api/mockapi";
import { useAuth } from "../src/store/auth";
import { useSync } from "../src/sync/useSync";
import { resetEnviando } from "../src/sync/envio";
import { theme } from "../src/constants/theme";

export default function RootLayout() {
  const { user, loading, init } = useAuth();
  useSync();
  const segments = useSegments();
  const router = useRouter();
  const persister = useMemo(() => createAsyncStoragePersister({ storage: AsyncStorage }), []);

  useEffect(() => {
    init();
    resetEnviando().catch(() => {}); // AUD-93: cualquier lectura atascada en "enviando" vuelve a "pendiente" al arrancar
  }, [init]);

  useEffect(() => {
    if (loading) return;
    const inLogin = segments[0] === "login";
    if (!user && !inLogin) router.replace("/login");
    else if (user && inLogin) router.replace("/");
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "EPMAPS_Tracker" }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="pendientes" options={{ title: "Pendientes" }} />
      </Stack>
    </PersistQueryClientProvider>
  );
}

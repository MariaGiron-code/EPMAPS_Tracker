import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { theme } from "../constants/theme";
import { BrandLogo } from "./BrandLogo";

type State = "loading" | "error" | "empty" | "pending";

export function StateView({
  state,
  message,
  onRetry,
}: {
  state: State;
  message?: string;
  onRetry?: () => void;
}) {
  if (state === "loading") {
    return (
      <View style={{ alignItems: "center", padding: theme.spacing[4] }}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={{ color: theme.colors.textOnDarkSecondary, marginTop: theme.spacing[2] }}>
          Cargando…
        </Text>
      </View>
    );
  }
  if (state === "error") {
    return (
      <View style={{ alignItems: "center", padding: theme.spacing[4] }}>
        <Text style={{ color: theme.colors.accent, marginBottom: theme.spacing[2], fontSize: theme.typography.title.fontSize, fontWeight: "700" }}>⚠</Text>
        <Text style={{ color: theme.colors.textOnDark, marginBottom: theme.spacing[2], textAlign: "center" }}>{message ?? "Ocurrió un error"}</Text>
        {onRetry && (
          <Pressable
            onPress={onRetry}
            style={{ minHeight: 44, minWidth: 44, paddingHorizontal: theme.spacing[4], justifyContent: "center" }}
          >
            <Text style={{ color: theme.colors.textOnDark, fontWeight: "600" }}>Reintentar</Text>
          </Pressable>
        )}
      </View>
    );
  }
  if (state === "empty") {
    return (
      <View style={{ alignItems: "center", padding: theme.spacing[4] }}>
        <View style={{ opacity: 0.3, marginBottom: theme.spacing[3] }}>
          <BrandLogo width={80} />
        </View>
        <Text style={{ color: theme.colors.textOnDarkSecondary, fontSize: theme.typography.subtitle.fontSize, textAlign: "center" }}>
          {message ?? "Sin resultados"}
        </Text>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center", padding: theme.spacing[2] }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.accent, marginRight: theme.spacing[2] }} />
      <Text style={{ color: theme.colors.textOnDarkSecondary }}>{message ?? "Pendiente"}</Text>
    </View>
  );
}

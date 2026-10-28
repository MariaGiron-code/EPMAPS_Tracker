import { View, Text } from "react-native";
import { useStatus } from "../store/status";
import { theme } from "../constants/theme";

export function StatusBadge() {
  const { online, pending } = useStatus();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[1],
        borderRadius: theme.radius.pill,
        backgroundColor: theme.glass.fill,
        borderWidth: 1,
        borderColor: theme.glass.border,
        marginBottom: theme.spacing[3],
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: online ? theme.colors.primary : theme.colors.accent,
          marginRight: theme.spacing[2],
        }}
      />
      <Text style={{ color: theme.colors.textOnDark, fontSize: theme.typography.caption.fontSize }}>
        {online ? "En línea" : "Sin conexión"} · {pending} pendiente{pending === 1 ? "" : "s"}
      </Text>
    </View>
  );
}

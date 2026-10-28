import { Pressable, Text, PressableProps } from "react-native";
import { theme } from "../constants/theme";

export function GlassButton({
  title,
  variant = "primary",
  ...props
}: PressableProps & { title: string; variant?: "primary" | "ghost" }) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: isPrimary ? theme.colors.primary : theme.glass.fill,
          borderWidth: isPrimary ? 0 : 1,
          borderColor: theme.glass.border,
          borderRadius: theme.radius.pill,
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
          minHeight: 44,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      {...props}
    >
      <Text style={{ color: theme.colors.textOnDark, fontSize: theme.typography.body.fontSize, fontWeight: "600" }}>
        {title}
      </Text>
    </Pressable>
  );
}

import { View, ViewStyle } from "react-native";
import { theme } from "../constants/theme";

type Variant = "glass" | "glassStrong" | "glassInput";

export function GlassView({
  variant = "glass",
  style,
  children,
}: {
  variant?: Variant;
  style?: ViewStyle;
  children?: React.ReactNode;
}) {
  const fill =
    variant === "glassStrong"
      ? theme.glass.strongFill
      : variant === "glassInput"
      ? theme.glass.inputFill
      : theme.glass.fill;
  const border =
    variant === "glassStrong"
      ? theme.glass.strongBorder
      : variant === "glassInput"
      ? theme.glass.inputBorder
      : theme.glass.border;

  return (
    <View
      style={[
        {
          backgroundColor: fill,
          borderWidth: 1,
          borderColor: border,
          borderTopColor: theme.colors.borderStrong,
          borderRadius: theme.radius.lg,
          padding: theme.spacing[3],
          ...theme.glass.shadow,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

import { TextInput, TextInputProps } from "react-native";
import { theme } from "../constants/theme";

export function GlassInput(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={theme.colors.textOnDarkSecondary}
      style={[
        {
          backgroundColor: theme.glass.inputFill,
          borderWidth: 1,
          borderColor: theme.glass.inputBorder,
          borderRadius: theme.radius.md,
          padding: theme.spacing[3],
          color: theme.colors.textOnDark,
          fontSize: theme.typography.body.fontSize,
        },
        props.style,
      ]}
      {...props}
    />
  );
}

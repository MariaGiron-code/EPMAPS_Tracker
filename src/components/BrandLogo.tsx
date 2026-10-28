import { Image, ImageStyle } from "react-native";

export function BrandLogo({ width = 120, style }: { width?: number; style?: ImageStyle }) {
  return (
    <Image
      source={require("../../assets/logo/epmaps-tracker-logo.png")}
      style={[{ width, height: width * (180 / 600), resizeMode: "contain" }, style]}
    />
  );
}

import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/store/auth";
import { GlassView } from "../src/components/GlassView";
import { GlassInput } from "../src/components/GlassInput";
import { GlassButton } from "../src/components/GlassButton";
import { BrandLogo } from "../src/components/BrandLogo";
import { StatusBadge } from "../src/components/StatusBadge";
import { theme } from "../src/constants/theme";

export default function Login() {
  const [code, setCode] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handle = async () => {
    const ok = await login(code, pass);
    if (ok) router.replace("/");
    else setError("Código o clave inválidos");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: "center", padding: theme.spacing[4] }}>
      <StatusBadge />
      <GlassView>
        <BrandLogo width={160} />
        <Text style={{ color: theme.colors.textOnDark, fontSize: theme.typography.title.fontSize, marginTop: theme.spacing[3] }}>
          Iniciar sesión
        </Text>
        <GlassInput placeholder="Código de empleado" value={code} onChangeText={setCode} autoCapitalize="characters" />
        <View style={{ height: theme.spacing[2] }} />
        <GlassInput placeholder="Clave" value={pass} onChangeText={setPass} secureTextEntry />
        {error ? <Text style={{ color: theme.colors.accentDark, marginTop: theme.spacing[2] }}>{error}</Text> : null}
        <View style={{ height: theme.spacing[3] }} />
        <GlassButton title="Entrar" onPress={handle} />
      </GlassView>
    </View>
  );
}

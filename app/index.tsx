import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { codigoMedidorSchema } from "../src/schemas/medidor";
import { fetchMedidor } from "../src/api/mockapi";
import { GlassView } from "../src/components/GlassView";
import { GlassInput } from "../src/components/GlassInput";
import { GlassButton } from "../src/components/GlassButton";
import { StateView } from "../src/components/StateView";
import { StatusBadge } from "../src/components/StatusBadge";
import { useAuth } from "../src/store/auth";
import { theme } from "../src/constants/theme";

export default function Index() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["medidor", submitted],
    queryFn: () => fetchMedidor(submitted),
    enabled: !!submitted,
  });

  const handle = () => {
    const r = codigoMedidorSchema.safeParse(codigo);
    if (!r.success) {
      setError("Código inválido. Formato: MED-123456");
      return;
    }
    setError("");
    setSubmitted(codigo);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing[4] }}>
      <StatusBadge />
      <GlassView>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing[3] }}>
          <Text style={{ color: theme.colors.textOnDark, fontSize: theme.typography.title.fontSize }}>
            Consultar medidor
          </Text>
          <GlassButton title="Salir" variant="ghost" onPress={handleLogout} />
        </View>
        <Text style={{ color: theme.colors.textOnDarkSecondary, fontSize: theme.typography.caption.fontSize, marginBottom: theme.spacing[3] }}>
          Sesión: {user}
        </Text>
        <GlassInput placeholder="MED-123456" value={codigo} onChangeText={setCodigo} autoCapitalize="characters" />
        {error ? <Text style={{ color: theme.colors.accentDark, marginTop: theme.spacing[2] }}>{error}</Text> : null}
        <View style={{ height: theme.spacing[3] }} />
        <GlassButton title="Consultar" onPress={handle} />
      </GlassView>

      <View style={{ marginTop: theme.spacing[4] }}>
        {isLoading && <StateView state="loading" />}
        {isError && <StateView state="error" message="No se pudo consultar" onRetry={handle} />}
        {data && (
          <GlassView>
            <Text style={{ color: theme.colors.textOnDark }}>Dirección: {data.direccion}</Text>
            <Text style={{ color: theme.colors.textOnDark }}>Sector: {data.sector}</Text>
            <Text style={{ color: theme.colors.textOnDark }}>Cuenta: {data.cuenta}</Text>
            <Text style={{ color: theme.colors.textOnDark }}>Estado: {data.estado}</Text>
            <Text style={{ color: theme.colors.textOnDark }}>Última lectura: {data.ultima_lectura} ({data.fecha_ultima})</Text>
            <Text style={{ color: theme.colors.textOnDark }}>Consumo promedio: {data.consumo_promedio}</Text>
          </GlassView>
        )}
      </View>
    </View>
  );
}

import { View, Text, FlatList, Alert, Modal } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { GlassView } from "../src/components/GlassView";
import { GlassInput } from "../src/components/GlassInput";
import { GlassButton } from "../src/components/GlassButton";
import { StatusBadge } from "../src/components/StatusBadge";
import { theme } from "../src/constants/theme";
import { listarPendientes, enviarUna } from "../src/sync/envio";
import { actualizarLectura } from "../src/services/lecturas";
import type { LecturaRow } from "../src/sync/envio";

export default function Pendientes() {
  const [items, setItems] = useState<LecturaRow[]>([]);
  const [editing, setEditing] = useState<LecturaRow | null>(null);
  const [estado, setEstado] = useState<"normal" | "inaccesible" | "danado">("normal");
  const [lectura, setLectura] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await listarPendientes();
      if (active) setItems(data);
    })();
    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setItems(await listarPendientes());
  }, []);

  const openEdit = (row: LecturaRow) => {
    setEditing(row);
    setEstado((row.estado_medidor as any) ?? "normal");
    setLectura(row.lectura != null ? String(row.lectura) : "");
    setMotivo(row.motivo ?? "");
    setDescripcion(row.descripcion_dano ?? "");
  };

  const saveEdit = async () => {
    if (!editing) return;
    const res = await actualizarLectura(editing.uuid, {
      estado,
      lectura: lectura ? Number(lectura) : undefined,
      motivo,
      descripcionDano: descripcion,
    });
    if (!res.ok) {
      Alert.alert("Error", res.message ?? "No se pudo guardar");
      return;
    }
    setEditing(null);
    await refresh();
  };

  const enviar = async (row: LecturaRow) => {
    const ok = await enviarUna(row);
    if (ok) Alert.alert("Enviada", "Lectura enviada.");
    else Alert.alert("Sin conexión", "No se pudo enviar ahora.");
    await refresh();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing[4] }}>
      <StatusBadge />
      <GlassView>
        <Text style={{ color: theme.colors.textOnDark, fontSize: theme.typography.title.fontSize, marginBottom: theme.spacing[3] }}>
          Lecturas pendientes
        </Text>
        {items.length === 0 ? (
          <Text style={{ color: theme.colors.textOnDarkSecondary }}>Sin pendientes.</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => i.uuid}
            renderItem={({ item }) => (
              <GlassView style={{ marginBottom: theme.spacing[2] }}>
                <Text style={{ color: theme.colors.textOnDark, fontWeight: "600" }}>
                  {item.codigo_medidor} · {item.mes}
                </Text>
                <Text style={{ color: theme.colors.textOnDarkSecondary, fontSize: theme.typography.caption.fontSize }}>
                  {item.estado_medidor} · {item.estado_envio}
                </Text>
                <View style={{ flexDirection: "row", gap: theme.spacing[2], marginTop: theme.spacing[2] }}>
                  <GlassButton title="Editar" variant="ghost" onPress={() => openEdit(item)} />
                  <GlassButton title="Enviar" onPress={() => enviar(item)} />
                </View>
              </GlassView>
            )}
          />
        )}
      </GlassView>

      <Modal visible={!!editing} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: theme.spacing[4] }}>
          <GlassView>
            <Text style={{ color: theme.colors.textOnDark, fontSize: theme.typography.title.fontSize, marginBottom: theme.spacing[3] }}>
              Editar pendiente
            </Text>
            <View style={{ flexDirection: "row", gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
              {(["normal", "inaccesible", "danado"] as const).map((e) => (
                <GlassButton key={e} title={e} variant={estado === e ? "primary" : "ghost"} onPress={() => setEstado(e)} />
              ))}
            </View>
            {estado === "normal" && (
              <GlassInput placeholder="Lectura" keyboardType="numeric" value={lectura} onChangeText={setLectura} />
            )}
            {estado === "inaccesible" && (
              <GlassInput placeholder="Motivo" value={motivo} onChangeText={setMotivo} />
            )}
            {estado === "danado" && (
              <GlassInput placeholder="Descripción del daño" value={descripcion} onChangeText={setDescripcion} />
            )}
            <View style={{ height: theme.spacing[3] }} />
            <GlassButton title="Guardar cambios" onPress={saveEdit} />
            <View style={{ height: theme.spacing[2] }} />
            <GlassButton title="Cancelar" variant="ghost" onPress={() => setEditing(null)} />
          </GlassView>
        </View>
      </Modal>
    </View>
  );
}

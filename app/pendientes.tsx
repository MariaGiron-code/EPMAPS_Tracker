import { View, Text, FlatList, Alert, Modal, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { GlassView } from "../src/components/GlassView";
import { GlassInput } from "../src/components/GlassInput";
import { GlassButton } from "../src/components/GlassButton";
import { StatusBadge } from "../src/components/StatusBadge";
import { theme } from "../src/constants/theme";
import { listarTodas, enviarUna } from "../src/sync/envio";
import { actualizarLectura } from "../src/services/lecturas";
import type { LecturaRow } from "../src/sync/envio";

// Etiqueta visual por estado de envío
const BADGE: Record<LecturaRow["estado_envio"], { label: string; color: string }> = {
  pendiente: { label: "Pendiente", color: "#F59E0B" },
  enviando:  { label: "Enviando…", color: theme.colors.primary },
  enviada:   { label: "Enviada ✓", color: "#22C55E" },
};

export default function Pendientes() {
  const [items, setItems] = useState<LecturaRow[]>([]);
  const [editing, setEditing] = useState<LecturaRow | null>(null);
  const [estado, setEstado] = useState<"normal" | "inaccesible" | "dañado">("normal");
  const [lectura, setLectura] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tick, setTick] = useState(0);

  // tick se incrementa para forzar re-carga tras cada mutación
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let active = true;
    listarTodas().then((data) => { if (active) setItems(data); });
    return () => { active = false; };
  }, [tick]);

  const openEdit = (row: LecturaRow) => {
    // Solo pendientes son editables
    if (row.estado_envio !== "pendiente") return;
    setEditing(row);
    setEstado((row.estado_medidor as "normal" | "inaccesible" | "dañado") ?? "normal");
    setLectura(row.lectura != null ? String(row.lectura) : "");
    setMotivo(row.motivo ?? "");
    setDescripcion(row.descripcion_dano ?? "");
  };

  const saveEdit = async () => {
    if (!editing) return;
    const res = await actualizarLectura(editing.uuid, {
      estado: estado === "dañado" ? "danado" : estado,
      lectura: lectura ? Number(lectura) : undefined,
      motivo,
      descripcionDano: descripcion,
    });
    if (!res.ok) {
      Alert.alert("Error", res.message ?? "No se pudo guardar");
      return;
    }
    setEditing(null);
    refresh();
  };

  const enviar = async (row: LecturaRow) => {
    const ok = await enviarUna(row);
    if (ok) Alert.alert("Enviada", "Lectura enviada correctamente.");
    else Alert.alert("Sin conexión", "No se pudo enviar ahora. Se reintentará al recuperar señal.");
    refresh();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing[4] }}>
      <StatusBadge />
      <GlassView>
        <Text
          style={{
            color: theme.colors.textOnDark,
            fontSize: theme.typography.title.fontSize,
            marginBottom: theme.spacing[3],
          }}
        >
          Todas las lecturas
        </Text>

        {items.length === 0 ? (
          <Text style={{ color: theme.colors.textOnDarkSecondary }}>Sin lecturas registradas.</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => i.uuid}
            renderItem={({ item }) => {
              const badge = BADGE[item.estado_envio];
              const esPendiente = item.estado_envio === "pendiente";

              return (
                <GlassView style={{ marginBottom: theme.spacing[2] }}>
                  {/* Cabecera */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ color: theme.colors.textOnDark, fontWeight: "600" }}>
                      {item.codigo_medidor} · {item.mes}
                    </Text>
                    <Text
                      style={{
                        color: badge.color,
                        fontSize: theme.typography.caption.fontSize,
                        fontWeight: "600",
                      }}
                    >
                      {badge.label}
                    </Text>
                  </View>

                  {/* Detalle */}
                  <Text
                    style={{
                      color: theme.colors.textOnDarkSecondary,
                      fontSize: theme.typography.caption.fontSize,
                      marginTop: theme.spacing[1],
                    }}
                  >
                    {item.estado_medidor}
                    {item.lectura != null ? ` · ${item.lectura} m³` : ""}
                  </Text>

                  {/* Acciones: solo disponibles para pendientes (AUD-100, AUD-101) */}
                  {esPendiente ? (
                    <View style={{ flexDirection: "row", gap: theme.spacing[2], marginTop: theme.spacing[2] }}>
                      <GlassButton title="Editar" variant="ghost" onPress={() => openEdit(item)} />
                      <GlassButton title="Enviar" onPress={() => enviar(item)} />
                    </View>
                  ) : (
                    <Text
                      style={{
                        color: theme.colors.textOnDarkSecondary,
                        fontSize: theme.typography.caption.fontSize,
                        marginTop: theme.spacing[2],
                        fontStyle: "italic",
                      }}
                    >
                      {item.estado_envio === "enviando" ? "Enviando, por favor espera…" : "Lectura enviada · no editable"}
                    </Text>
                  )}
                </GlassView>
              );
            }}
          />
        )}
      </GlassView>

      {/* Modal de edición — solo se abre para pendientes */}
      <Modal
        visible={!!editing}
        transparent
        animationType="slide"
        onRequestClose={() => setEditing(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.overlay,
            justifyContent: "center",
            padding: theme.spacing[4],
          }}
        >
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <GlassView variant="glassStrong" style={{ width: "100%", alignSelf: "center" }}>
              <ScrollView
                contentContainerStyle={{ gap: theme.spacing[3] }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={{
                    color: theme.colors.textOnDark,
                    fontSize: theme.typography.title.fontSize,
                    fontWeight: theme.typography.title.fontWeight,
                  }}
                >
                  Editar lectura pendiente
                </Text>

                <Text style={{ color: theme.colors.textOnDarkSecondary, fontSize: theme.typography.caption.fontSize }}>
                  Estado del medidor
                </Text>
                <View style={{ gap: theme.spacing[2] }}>
                  {(["normal", "inaccesible", "dañado"] as const).map((e) => (
                    <GlassButton
                      key={e}
                      title={e}
                      variant={estado === e ? "primary" : "ghost"}
                      onPress={() => setEstado(e)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: estado === e }}
                      style={{ width: "100%" }}
                    />
                  ))}
                </View>

                {estado === "normal" && (
                  <GlassInput
                    placeholder="Lectura (m³)"
                    keyboardType="numeric"
                    value={lectura}
                    onChangeText={setLectura}
                  />
                )}
                {estado === "inaccesible" && (
                  <GlassInput placeholder="Motivo" value={motivo} onChangeText={setMotivo} />
                )}
                {estado === "dañado" && (
                  <GlassInput
                    placeholder="Descripción del daño"
                    value={descripcion}
                    onChangeText={setDescripcion}
                  />
                )}

                <View style={{ gap: theme.spacing[2] }}>
                  <GlassButton title="Guardar cambios" onPress={saveEdit} />
                  <GlassButton title="Cancelar" variant="ghost" onPress={() => setEditing(null)} />
                </View>
              </ScrollView>
            </GlassView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

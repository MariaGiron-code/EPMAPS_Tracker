import { View, Text, Image, Alert, ScrollView } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import NetInfo from "@react-native-community/netinfo";
import { lecturaFormSchema, LecturaForm } from "../../src/schemas/medidor";
import { GlassView } from "../../src/components/GlassView";
import { GlassInput } from "../../src/components/GlassInput";
import { GlassButton } from "../../src/components/GlassButton";
import { StatusBadge } from "../../src/components/StatusBadge";
import { theme } from "../../src/constants/theme";
import { fetchMedidor } from "../../src/api/mockapi";
import { guardarLecturaPendiente } from "../../src/services/lecturas";
import { useDraftForCodigo } from "../../src/store/draft";
import { enviarPendientes, contarPendientes } from "../../src/sync/envio";
import { useStatus } from "../../src/store/status";
import { fmtFecha } from "../../src/utils/fmt";

const FOTOS_DIR = (FileSystem.documentDirectory ?? "") + "fotos/";

export default function Lectura() {
  const params = useLocalSearchParams<{ codigo?: string }>();
  const router = useRouter();
  const codigoInicial = (params.codigo ?? "").toString();
  const draftStore = useDraftForCodigo(codigoInicial);
  const { draft, setDraft } = draftStore();
  const { control, handleSubmit, watch, setValue, reset, formState } = useForm<LecturaForm>({
    resolver: zodResolver(lecturaFormSchema) as any,
    defaultValues: { estado: "normal", codigo: codigoInicial },
  });
  const estado = watch("estado");
  const fotoRuta = watch("fotoRuta");
  const lecturaActual = watch("lectura");
  const values = watch();
  const serializedValues = JSON.stringify(values);
  const [permisoDenegado, setPermisoDenegado] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const promptShown = useRef(false);
  const setPending = useStatus((s) => s.setPending);

  const { data: medidor } = useQuery({
    queryKey: ["medidor", codigoInicial],
    queryFn: () => fetchMedidor(codigoInicial),
    enabled: !!codigoInicial,
  });

  const lecturaAnterior = medidor?.ultima_lectura;
  const consumoPromedio = medidor?.consumo_promedio;
  const tieneAnterior = lecturaAnterior != null && !Number.isNaN(Number(lecturaAnterior));
  const consumo =
    tieneAnterior && lecturaActual != null && !Number.isNaN(Number(lecturaActual))
      ? Number(lecturaActual) - Number(lecturaAnterior)
      : null;
  const anomalo = consumo != null && consumoPromedio != null && consumo > 3 * Number(consumoPromedio);
  const fotoObligatoria = estado === "danado" || anomalo;

  useEffect(() => {
    if (promptShown.current || formState.isDirty || !draft) return;
    promptShown.current = true;
    if (draft.codigo !== codigoInicial) {
      setDraft(null);
      return;
    }
    Alert.alert(
      "Borrador encontrado",
      "Tienes un registro a medias. ¿Deseas continuar?",
      [
        { text: "Descartar", style: "destructive", onPress: () => setDraft(null) },
        { text: "Continuar", onPress: () => reset(draft as Partial<LecturaForm>) },
      ],
      { cancelable: false }
    );
  }, [codigoInicial, draft, formState.isDirty, reset, setDraft]);

  useEffect(() => {
    if (!formState.isDirty) return;
    const timer = setTimeout(() => {
      setDraft({
        ...(JSON.parse(serializedValues) as Record<string, unknown>),
        codigo: codigoInicial,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [codigoInicial, formState.isDirty, serializedValues, setDraft]);

  useEffect(() => {
    if (!anomalo) setConfirmado(false);
  }, [anomalo]);

  const tomarFoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setPermisoDenegado(true);
      if (fotoObligatoria) {
        Alert.alert("Permiso de cámara", "La app necesita la cámara para respaldar la lectura. Activa el permiso en ajustes.");
      }
      return;
    }
    setPermisoDenegado(false);
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (result.canceled || !result.assets?.[0]) return;
    await FileSystem.makeDirectoryAsync(FOTOS_DIR, { intermediates: true });
    const destino = `${FOTOS_DIR}${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: result.assets[0].uri, to: destino });
    setValue("fotoRuta", destino, { shouldDirty: true });
  };

  const onSubmit = async (data: LecturaForm) => {
    if (fotoObligatoria && !data.fotoRuta) {
      Alert.alert("Foto obligatoria", "Debes tomar la foto para continuar.");
      return;
    }
    if (permisoDenegado && fotoObligatoria) {
      Alert.alert("Permiso denegado", "No se puede guardar sin la foto obligatoria.");
      return;
    }
    if (anomalo && !confirmado) {
      Alert.alert("Confirmación requerida", "Debes confirmar que revisaste el medidor.");
      return;
    }
    const res = await guardarLecturaPendiente({
      codigo: data.codigo || codigoInicial,
      estado: data.estado,
      lectura: data.lectura,
      motivo: data.motivo,
      descripcionDano: data.descripcionDano,
      fotoRuta: data.fotoRuta,
    });
    if (!res.ok) {
      Alert.alert("No se pudo guardar", res.message ?? "Error");
      return;
    }
    const netState = await NetInfo.fetch();
    if (netState.isConnected && netState.isInternetReachable) {
      await enviarPendientes();
    }
    setPending(await contarPendientes());
    setDraft(null);
    Alert.alert(
      "Guardado",
      netState.isConnected && netState.isInternetReachable
        ? "Lectura guardada y enviada."
        : "Lectura guardada como pendiente."
    );
  };

  const errorText = (message?: string) =>
    message ? <Text style={{ color: theme.colors.accentDark, marginTop: theme.spacing[1] }}>{message}</Text> : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing[4] }} keyboardShouldPersistTaps="handled">
        <StatusBadge />
        <GlassView>
          <Text style={{ color: theme.colors.textOnDark, fontSize: theme.typography.title.fontSize, marginBottom: theme.spacing[3] }}>
            Registrar lectura
          </Text>

          {medidor && (
            <View style={{ marginBottom: theme.spacing[3] }}>
              <Text style={{ color: theme.colors.textOnDarkSecondary, fontSize: theme.typography.caption.fontSize }}>
                Lectura anterior: {tieneAnterior ? `${lecturaAnterior} (${fmtFecha(medidor.fecha_ultima)})` : "sin lectura previa"}
              </Text>
              {tieneAnterior && consumoPromedio != null && (
                <Text style={{ color: theme.colors.textOnDarkSecondary, fontSize: theme.typography.caption.fontSize }}>
                  Consumo promedio: {consumoPromedio}
                </Text>
              )}
            </View>
          )}

          <Controller
            control={control}
            name="estado"
            render={({ field: { onChange, value } }) => (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
                {(["normal", "inaccesible", "danado"] as const).map((e) => (
                  <GlassButton
                    key={e}
                    title={e}
                    variant={value === e ? "primary" : "ghost"}
                    onPress={() => onChange(e)}
                    style={{ flex: 1, minWidth: "30%" }}
                  />
                ))}
              </View>
            )}
          />

          {estado === "normal" && (
            <Controller
              control={control}
              name="lectura"
              render={({ field: { onChange, value }, fieldState }) => (
                <>
                  <GlassInput placeholder="Lectura" keyboardType="numeric" value={value?.toString() ?? ""} onChangeText={onChange} />
                  {errorText(fieldState.error?.message)}
                </>
              )}
            />
          )}
          {estado === "inaccesible" && (
            <Controller
              control={control}
              name="motivo"
              render={({ field: { onChange, value }, fieldState }) => (
                <>
                  <GlassInput placeholder="Motivo" value={value ?? ""} onChangeText={onChange} />
                  {errorText(fieldState.error?.message)}
                </>
              )}
            />
          )}
          {estado === "danado" && (
            <Controller
              control={control}
              name="descripcionDano"
              render={({ field: { onChange, value }, fieldState }) => (
                <>
                  <GlassInput placeholder="Descripción del daño" value={value ?? ""} onChangeText={onChange} />
                  {errorText(fieldState.error?.message)}
                </>
              )}
            />
          )}

          {consumo != null && (
            <Text style={{ color: anomalo ? theme.colors.accent : theme.colors.textOnDarkSecondary, marginTop: theme.spacing[2] }}>
              Consumo del mes: {consumo}{anomalo ? " (anómalo: supera el triple del promedio)" : ""}
            </Text>
          )}
          {anomalo && (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: theme.spacing[2] }}>
              <GlassButton
                title={confirmado ? "✓ Revisado" : "Confirmo que revisé el medidor"}
                variant={confirmado ? "primary" : "ghost"}
                onPress={() => setConfirmado((v) => !v)}
              />
            </View>
          )}

          <View style={{ height: theme.spacing[2] }} />
          <GlassButton title="Tomar foto" onPress={tomarFoto} style={fotoObligatoria && !fotoRuta ? { borderColor: theme.colors.accent, borderWidth: 2 } : undefined} />
          {fotoObligatoria && !fotoRuta && (
            <Text style={{ color: theme.colors.accentDark, marginTop: theme.spacing[1] }}>* Foto obligatoria</Text>
          )}
          {fotoRuta ? <Image source={{ uri: fotoRuta }} style={{ width: "100%", height: 160, marginTop: theme.spacing[2], borderRadius: theme.radius.md }} /> : null}
          {permisoDenegado && (
            <Text style={{ color: theme.colors.textOnDark, marginTop: theme.spacing[2] }}>
              Permiso de cámara denegado. {fotoObligatoria ? "La foto es obligatoria." : "Puedes continuar sin foto."}
            </Text>
          )}

          <View style={{ height: theme.spacing[3] }} />
          <GlassButton title="Guardar" onPress={handleSubmit(onSubmit)} />
          <View style={{ height: theme.spacing[2] }} />
          <GlassButton title="Volver" variant="ghost" onPress={() => router.back()} />
        </GlassView>
      </ScrollView>
    </View>
  );
}

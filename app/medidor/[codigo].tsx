import { View, Text, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { lecturaFormSchema, LecturaForm } from "../../src/schemas/medidor";
import { GlassView } from "../../src/components/GlassView";
import { GlassInput } from "../../src/components/GlassInput";
import { GlassButton } from "../../src/components/GlassButton";
import { StatusBadge } from "../../src/components/StatusBadge";
import { theme } from "../../src/constants/theme";
import { fetchMedidor } from "../../src/api/mockapi";
import { guardarLecturaPendiente } from "../../src/services/lecturas";
import { useDraft } from "../../src/store/draft";

const FOTOS_DIR = (FileSystem.documentDirectory ?? "") + "fotos/";

export default function Lectura() {
  const params = useLocalSearchParams<{ codigo?: string }>();
  const router = useRouter();
  const codigoInicial = (params.codigo ?? "").toString();

  const { draft, setDraft } = useDraft();
  const { control, handleSubmit, watch, setValue, reset } = useForm<LecturaForm>({
    resolver: zodResolver(lecturaFormSchema) as any,
    defaultValues: { estado: "normal", codigo: codigoInicial },
  });
  const estado = watch("estado");
  const fotoRuta = watch("fotoRuta");
  const lecturaActual = watch("lectura");
  const [permisoDenegado, setPermisoDenegado] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

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

  // Ofrecer continuar/descartar si hay borrador al abrir
  useEffect(() => {
    if (draft) {
      Alert.alert(
        "Borrador encontrado",
        "Tienes un registro a medias. ¿Deseas continuar?",
        [
          { text: "Descartar", style: "destructive", onPress: () => setDraft(null) },
          { text: "Continuar", onPress: () => reset(draft as Partial<LecturaForm>) },
        ],
        { cancelable: false }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar borrador en cada cambio
  const values = watch();
  useEffect(() => {
    const t = setTimeout(() => setDraft({ ...values }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  // Resetear confirmación si deja de ser anómalo
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
    const asset = result.assets[0];
    await FileSystem.makeDirectoryAsync(FOTOS_DIR, { intermediates: true });
    const destino = FOTOS_DIR + Date.now() + ".jpg";
    await FileSystem.copyAsync({ from: asset.uri, to: destino });
    setValue("fotoRuta", destino);
  };

  const onSubmit = async (data: any) => {
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
    setDraft(null);
    Alert.alert("Guardado", "Lectura guardada como pendiente.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing[4] }}>
      <StatusBadge />
      <GlassView>
        <Text style={{ color: theme.colors.textOnDark, fontSize: theme.typography.title.fontSize, marginBottom: theme.spacing[3] }}>
          Registrar lectura
        </Text>

        {medidor && (
          <View style={{ marginBottom: theme.spacing[3] }}>
            <Text style={{ color: theme.colors.textOnDarkSecondary, fontSize: theme.typography.caption.fontSize }}>
              Lectura anterior: {tieneAnterior ? `${lecturaAnterior} (${medidor.fecha_ultima})` : "sin lectura previa"}
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
            <View style={{ flexDirection: "row", gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
              {["normal", "inaccesible", "danado"].map((e) => (
                <GlassButton key={e} title={e} variant={value === e ? "primary" : "ghost"} onPress={() => onChange(e)} />
              ))}
            </View>
          )}
        />

        {estado === "normal" && (
          <Controller
            control={control}
            name="lectura"
            render={({ field: { onChange, value } }) => (
              <GlassInput placeholder="Lectura" keyboardType="numeric" value={value?.toString()} onChangeText={onChange} />
            )}
          />
        )}

        {estado === "inaccesible" && (
          <Controller
            control={control}
            name="motivo"
            render={({ field: { onChange, value } }) => (
              <GlassInput placeholder="Motivo" value={value} onChangeText={onChange} />
            )}
          />
        )}

        {estado === "danado" && (
          <Controller
            control={control}
            name="descripcionDano"
            render={({ field: { onChange, value } }) => (
              <GlassInput placeholder="Descripción del daño" value={value} onChangeText={onChange} />
            )}
          />
        )}

        {consumo != null && (
          <Text style={{ color: anomalo ? theme.colors.accent : theme.colors.textOnDarkSecondary, marginTop: theme.spacing[2] }}>
            Consumo del mes: {consumo}
            {anomalo ? " (anómalo: supera el triple del promedio)" : ""}
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
        <GlassButton title="Tomar foto" onPress={tomarFoto} />
        {fotoRuta ? (
          <Image source={{ uri: fotoRuta }} style={{ width: "100%", height: 160, marginTop: theme.spacing[2], borderRadius: theme.radius.md }} />
        ) : null}
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
    </View>
  );
}

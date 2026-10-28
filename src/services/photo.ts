import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

const PHOTO_DIR = `${FileSystem.documentDirectory}photos/`;

export async function ensurePhotoDir() {
  const info = await FileSystem.getInfoAsync(PHOTO_DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
}

export async function takePhoto(): Promise<string | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) return null;
  const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
  if (res.canceled) return null;
  await ensurePhotoDir();
  const src = res.assets[0].uri;
  const dest = `${PHOTO_DIR}${Date.now()}.jpg`;
  await FileSystem.copyAsync({ from: src, to: dest });
  return dest;
}

export async function photoExists(uri: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(uri);
  return info.exists;
}

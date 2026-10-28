import { StyleSheet, Text, View } from 'react-native';

// Pantalla provisional del proyecto base. Se reemplaza en T-05 (login).
export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EPMAPS_Tracker</Text>
      <Text>Proyecto base listo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
});

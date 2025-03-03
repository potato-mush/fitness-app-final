import { View, StyleSheet, useWindowDimensions } from 'react-native';

export default function Overlay() {
  const window = useWindowDimensions();
  const rectSize = 250;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View style={[styles.overlay, { height: (window.height - rectSize) / 2 }]} />
      <View style={styles.centerRow}>
        <View style={[styles.overlay, { width: (window.width - rectSize) / 2 }]} />
        <View style={[styles.scanner, { width: rectSize, height: rectSize }]}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <View style={[styles.overlay, { width: (window.width - rectSize) / 2 }]} />
      </View>
      <View style={[styles.overlay, { height: (window.height - rectSize) / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerRow: {
    flexDirection: 'row',
  },
  scanner: {
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
}); 
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { colors, radii, spacing } from "@sudoku-v/design-tokens";
import { countFilledCells, hydrateBoard } from "@sudoku-v/game-engine";
import { BOARD_SIZE } from "@sudoku-v/shared-types";

const previewBoard = hydrateBoard(
  "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
);

const filledCellCount = countFilledCells(previewBoard);

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Mobile scaffold</Text>
        <Text style={styles.title}>Sudoku V is set up for iOS and Android.</Text>
        <Text style={styles.description}>
          This Expo shell already imports the shared Sudoku engine, shared
          constants, and shared design tokens from the monorepo.
        </Text>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{BOARD_SIZE}x{BOARD_SIZE}</Text>
            <Text style={styles.metricLabel}>Board size</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{filledCellCount}</Text>
            <Text style={styles.metricLabel}>Preview givens</Text>
          </View>
        </View>

        <View style={styles.boardCard}>
          {previewBoard.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.boardRow}>
              {row.map((cell, colIndex) => {
                const boxRight = (colIndex + 1) % 3 === 0 && colIndex !== BOARD_SIZE - 1;
                const boxBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== BOARD_SIZE - 1;

                return (
                  <View
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      styles.cell,
                      cell.value === null ? styles.cellEmpty : styles.cellFilled,
                      boxRight ? styles.cellBoxRight : null,
                      boxBottom ? styles.cellBoxBottom : null
                    ]}
                  >
                    <Text style={styles.cellText}>{cell.value ?? ""}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Next implementation targets</Text>
          <Text style={styles.panelItem}>1. Build the interactive board and touch-first input controls.</Text>
          <Text style={styles.panelItem}>2. Add undo, notes mode, and conflict feedback.</Text>
          <Text style={styles.panelItem}>3. Persist active games and player statistics offline.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 36
  },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    padding: spacing.md
  },
  metricValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "800"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4
  },
  boardCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    overflow: "hidden"
  },
  boardRow: {
    flexDirection: "row"
  },
  cell: {
    aspectRatio: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: "rgba(19, 34, 56, 0.14)",
    borderBottomColor: "rgba(19, 34, 56, 0.14)"
  },
  cellFilled: {
    backgroundColor: "rgba(255, 255, 255, 0.92)"
  },
  cellEmpty: {
    backgroundColor: "rgba(253, 232, 226, 0.42)"
  },
  cellBoxRight: {
    borderRightWidth: 2,
    borderRightColor: colors.ink
  },
  cellBoxBottom: {
    borderBottomWidth: 2,
    borderBottomColor: colors.ink
  },
  cellText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700"
  },
  panel: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.sm
  },
  panelItem: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  }
});


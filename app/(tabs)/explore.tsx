
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TabTwoScreen() {
	return (
		<ThemedView style={styles.titleContainer}>
			<ThemedText type="title">History</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
});

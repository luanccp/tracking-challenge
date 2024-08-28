import React from "react";
import { ScrollView, StyleSheet, Switch } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { TextInput } from "@/components/TextInput";
import { useHistory } from "@/contexts/history";

export default function HomeScreen() {
	const {
		onStartAutoTracking,
		isAutoTrackingEnabled,
		onChangeLatitude,
		onChangeLongitude,
	} = useHistory();

	return (
		<ScrollView style={styles.container}>
			<ThemedView>
				<TextInput
					label="Destination Latitude"
					placeholder="Lat"
					onChangeText={onChangeLatitude}
					inputMode="numeric"
				/>
				<TextInput
					label="Destination Longitude"
					placeholder="Long"
					onChangeText={onChangeLongitude}
					inputMode="numeric"
				/>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText>Auto-tracking</ThemedText>
				<Switch
					value={isAutoTrackingEnabled}
					onValueChange={onStartAutoTracking}
				/>
			</ThemedView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 4,
		marginTop: 100,
	},

	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
});

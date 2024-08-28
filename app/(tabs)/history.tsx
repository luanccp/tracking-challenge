
import { FlatList, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHistory } from "@/contexts/history";
import React from "react";

export default function History() {
	const { history } = useHistory();

	const groupedByActivityType = history.reduce((acc, item) => {
		
		const { activityType, tripId } = item;

		// If the type is not yet a key in the accumulator, create an empty array for it
		if (!acc[tripId]) {
			acc[activityType] = [];
		}

		// Push the current item into the correct activityType array
		acc[activityType].push(item);

		return acc;
	}, {});

	// TODO: filter by trip ID

	// TODO: calculate the distance

	// TODO: calculate the duration

	return (
		<ScrollView style={styles.container}>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">History</ThemedText>
			</ThemedView>
			<ThemedView style={styles.column}>
				{history.map((h) => (
					<React.Fragment key={h.timestamp}>
						<ThemedView style={styles.row}>
							<ThemedText type="defaultSemiBold">TripID </ThemedText>
							<ThemedText>{h.tripId}</ThemedText>
						</ThemedView>
						<ThemedView style={styles.row}>
							<ThemedText type="defaultSemiBold">Timestamp </ThemedText>
							<ThemedText>{h.timestamp}</ThemedText>
						</ThemedView>
						<ThemedView style={styles.row}>
							<ThemedText type="defaultSemiBold">Lat/Long </ThemedText>
							<ThemedText>{h.startLocation?.latitude} / </ThemedText>
							<ThemedText>{h.startLocation?.longitude} </ThemedText>
						</ThemedView>
						<ThemedView
							style={{ flex: 1, height: 2, backgroundColor: "black" }}
						/>
					</React.Fragment>
				))}
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

	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
	row:{
		flexDirection: 'row',
		gap: 4,
	},
	column:{
		flexDirection: 'column'

	}
});

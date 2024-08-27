import type React from "react";
import {
	type TextInputProps,
	TextInput as RNTextInput,
	StyleSheet,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface Props extends TextInputProps {
	label: string;
}

export const TextInput: React.FC<Props> = ({ label, ...rest }, ) => {
	return (
		<ThemedView style={styles.container}>
			<ThemedText>{label}</ThemedText>
            <ThemedView style={styles.inputContainer}>

			<RNTextInput {...rest} />
            </ThemedView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inputContainer: {
		flex: 1,
		borderColor: "#1E1F22",
		borderWidth: 1,
		padding: 12,
		borderRadius: 8,
	},
});

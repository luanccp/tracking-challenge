import React from "react";
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
} from "react";
import BackgroundGeolocation, {
	type Subscription,
	type Location,
} from "react-native-background-geolocation";

interface HistoryLocation {
	tripId: number;
	startLocation: {
		latitude: string;
		longitude: string;
	};
	// duration: number;
	// distance: number;
	timestamp:string;
	activityType: string; // create an enum "still on_foot running on_bicycle in_vehicle unknown"
}

interface HistoryState {
	// States
	history: HistoryLocation[];
	isAutoTrackingEnabled: boolean;
	currentLocation?: Coordinates;
	targetLocation?: Coordinates;
	// Actions
	onStartAutoTracking: (value: boolean) => void;
	onChangeLatitude: (newValue: string) => void;
	onChangeLongitude: (newValue: string) => void;
}

const initialState: HistoryState = {
	isAutoTrackingEnabled: false,
	history: [],
	onStartAutoTracking: () => {},
	onChangeLatitude: () => {},
	onChangeLongitude: () => {},
};

const HistoryContext = createContext<HistoryState>(initialState);

export function useHistory(): HistoryState {
	const value = useContext(HistoryContext);

	if (!value) {
		throw new Error("useHistory must be wrapped in a <HistoryProvider />");
	}
	return value;
}
interface Coordinates {
	latitude: string;
	longitude: string;
}

export function HistoryProvider({ children }: PropsWithChildren) {
	const [enabled, setEnabled] = React.useState(false);
	const [history, setHistory] = React.useState<HistoryLocation[]>([]);
	const [currentLocation, setCurrentLocation] = React.useState<Coordinates>();
	const [targetLocation, setDestination] = React.useState<Coordinates>();
	const [startLocation, setStartLocation] = React.useState<Coordinates>();
	const [tripId, setTripId] = React.useState(0);

	const onStartAutoTracking = useCallback(async (startTracking: boolean) => {
		try {
			if (startTracking) {
				await BackgroundGeolocation.start();
				setEnabled(true);
			} else {
				await BackgroundGeolocation.stop();
				setEnabled(false);
			}
		} catch (error) {}
	}, []);

	const onChangeActivity = useCallback(
		({ activityType }: { activityType: string }) => {
			setHistory((prev) => {
				const lastItem = prev.length - 1;
				const newRow = { ...prev[lastItem], activityType };
				return prev.concat(newRow);
			});
		},
		[],
	);

	const onChangeLatitude = (newValue: string) =>
		setDestination((prev) => ({
			longitude: prev?.longitude ?? "",
			latitude: newValue,
		}));

	const onChangeLongitude = (newValue: string) =>
		setDestination((prev) => ({
			latitude: prev?.latitude ?? "",
			longitude: newValue,
		}));

	const onAddHistory = useCallback(
		(newLocation: Location) => {
			setHistory((prev) => {
				const lastItem = prev.length - 1;
				const newRow: HistoryLocation = {
					...prev[lastItem],
					tripId,
					startLocation: {
						latitude: startLocation?.latitude ?? "",
						longitude: startLocation?.longitude ?? "",
					},
					timestamp: newLocation.timestamp,
					activityType: newLocation?.activity?.type,
				};
				return prev.concat(newRow);
			});
		},
		[tripId, startLocation],
	);

	React.useEffect(() => {
		/// 1.  Subscribe to events.
		const onLocation: Subscription = BackgroundGeolocation.onLocation(
			(location) => {
				setCurrentLocation({
					longitude: String(location?.coords?.longitude),
					latitude: String(location?.coords?.latitude),
				});
				onAddHistory(location);
			},
		);

		const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
			(event) => {
				setStartLocation({
					longitude: String(event.location?.coords?.longitude),
					latitude: String(event.location?.coords?.latitude),
				});
			},
		);

		const onActivityChange: Subscription =
			BackgroundGeolocation.onActivityChange((event) => {
				onChangeActivity({
					activityType: event.activity ?? "NOT_DEFINED",
				});
			});

		/// 2. ready the plugin.
		BackgroundGeolocation.ready({
			// Geolocation Config
			desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
			distanceFilter: 10,
			// Activity Recognition
			stopTimeout: 5,
			// Application config
			debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
			logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
			stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
			startOnBoot: true, // <-- Auto start tracking when device is powered-up.
			// HTTP / SQLite config
			stopOnStationary: true,
			url: "https://postman-echo.com/post",
		}).then((state) => {
			setEnabled(state.enabled);
		});

		return () => {
			// Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
			// during development live-reload.  Without this, event-listeners will accumulate with
			// each refresh during live-reload.
			onLocation.remove();
			onMotionChange.remove();
			onActivityChange.remove();
		};
	}, [onChangeActivity, onAddHistory]);

	React.useEffect(() => {
		if (
			currentLocation?.latitude === targetLocation?.latitude &&
			currentLocation?.longitude === targetLocation?.longitude
		) {
			setTripId((prev) => prev + 1);
			setEnabled(false);
		}
	}, [currentLocation, targetLocation]);

	return (
		<HistoryContext.Provider
			value={{
				...initialState,
				history,
				targetLocation: targetLocation,
				currentLocation,
				isAutoTrackingEnabled: enabled,
				// actions
				onStartAutoTracking,
				onChangeLatitude,
				onChangeLongitude,
			}}
		>
			{children}
		</HistoryContext.Provider>
	);
}
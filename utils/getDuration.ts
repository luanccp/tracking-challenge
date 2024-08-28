
interface GetDurationDTO {
	originLocation: {
		latitude: number;
		longitude: number;
	};
	targetLocation: {
		latitude: number;
		longitude: number;
	};
    avgSpeed: number
}
/**
 * @description Get the duration traveled using lat and long and avg speed
 * @param originLocation by lat and long
 * @param targetLocation by lat and long
 * @param avgSpeed measure in m/s
 * @returns distance in ms
 */
export const getDuration = ({
	originLocation,
	targetLocation,
	avgSpeed,
}: GetDurationDTO): number => {
	// TODO:

	return 0;
};
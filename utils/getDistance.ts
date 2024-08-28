
interface GetDistanceDTO {
	originLocation: {
		latitude: number;
		longitude: number;
	};
	targetLocation: {
		latitude: number;
		longitude: number;
	};
}
/**
 * @description Get the distance traveled using lat and long
 * @param originLocation by lat and long
 * @param targetLocation by lat and long
 * @returns distance in meters
 */
export const getDistance = ({
	originLocation,
	targetLocation,
}: GetDistanceDTO): number => {
	// TODO:

	return 0;
};
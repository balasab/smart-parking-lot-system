import { ParkingSpot } from '../models/ParkingSpot.js';
import { ParkingSpotType, VehicleType } from '../models/types.js';

const spotSizePriority: Record<string, number> = {
    [ParkingSpotType.SMALL]: 1,
    [ParkingSpotType.MEDIUM]: 2,
    [ParkingSpotType.LARGE]: 3,
};

export class AllocationService {
    public static findSpot(spots: ParkingSpot[], vehicleType: VehicleType): ParkingSpot | undefined {
        const eligibleSpots = [...spots].filter(
            spot => spot.getIsAvailable() && spot.canFitVehicle(vehicleType)
        );

        if (eligibleSpots.length === 0) return undefined;

        // Sort by priority (ascending) and return the first one
        return eligibleSpots.sort((a, b) =>
            spotSizePriority[a.getType()]! - spotSizePriority[b.getType()]!
        )[0];
    }
}

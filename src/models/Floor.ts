import { ParkingSpot } from './ParkingSpot.js';

export class Floor {
    private floorNumber: number;
    private spots: ParkingSpot[];

    constructor(floorNumber: number, spots: ParkingSpot[]) {
        this.floorNumber = floorNumber;
        this.spots = spots;
    }

    public getFloorNumber(): number {
        return this.floorNumber;
    }

    public getSpots(): ParkingSpot[] {
        return this.spots;
    }

    public getAvailableSpotsCount(): number {
        return this.spots.filter(s => s.getIsAvailable()).length;
    }
}

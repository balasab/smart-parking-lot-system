import { ParkingSpotType, VehicleType } from './types.js';

export class ParkingSpot {
    private id: string;
    private type: ParkingSpotType;
    private isAvailable: boolean;
    private floorNumber: number;

    constructor(id: string, type: ParkingSpotType, floorNumber: number) {
        this.id = id;
        this.type = type;
        this.isAvailable = true;
        this.floorNumber = floorNumber;
    }

    public canFitVehicle(vehicleType: VehicleType): boolean {
        switch (this.type) {
            case ParkingSpotType.SMALL:
                return vehicleType === VehicleType.MOTORCYCLE;
            case ParkingSpotType.MEDIUM:
                return vehicleType === VehicleType.MOTORCYCLE || vehicleType === VehicleType.CAR;
            case ParkingSpotType.LARGE:
                return true; // Large spots can fit any vehicle
            default:
                return false;
        }
    }

    public assignVehicle(): void {
        this.isAvailable = false;
    }

    public removeVehicle(): void {
        this.isAvailable = true;
    }

    public getId(): string {
        return this.id;
    }

    public getType(): ParkingSpotType {
        return this.type;
    }

    public getIsAvailable(): boolean {
        return this.isAvailable;
    }

    public getFloorNumber(): number {
        return this.floorNumber;
    }
}

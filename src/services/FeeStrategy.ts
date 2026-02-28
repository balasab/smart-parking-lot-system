import { VehicleType } from '../models/types.js';

export interface ParkingFeeStrategy {
    calculateFee(entryTime: Date, exitTime: Date, vehicleType: VehicleType): number;
}

export class HourlyFeeStrategy implements ParkingFeeStrategy {
    private hourlyRates: Map<VehicleType, number>;

    constructor() {
        this.hourlyRates = new Map<VehicleType, number>();
        this.hourlyRates.set(VehicleType.MOTORCYCLE, 5);
        this.hourlyRates.set(VehicleType.CAR, 10);
        this.hourlyRates.set(VehicleType.BUS, 20);
    }

    public calculateFee(entryTime: Date, exitTime: Date, vehicleType: VehicleType): number {
        const durationInMillis = exitTime.getTime() - entryTime.getTime();
        const durationInHours = Math.ceil(durationInMillis / (1000 * 60 * 60));
        const rate = this.hourlyRates.get(vehicleType) || 0;
        return durationInHours * rate;
    }
}

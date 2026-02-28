import { VehicleType } from './types.js';

export abstract class Vehicle {
    protected licensePlate: string;
    protected type: VehicleType;

    constructor(licensePlate: string, type: VehicleType) {
        this.licensePlate = licensePlate;
        this.type = type;
    }

    public getLicensePlate(): string {
        return this.licensePlate;
    }

    public getType(): VehicleType {
        return this.type;
    }
}

export class Motorcycle extends Vehicle {
    constructor(licensePlate: string) {
        super(licensePlate, VehicleType.MOTORCYCLE);
    }
}

export class Car extends Vehicle {
    constructor(licensePlate: string) {
        super(licensePlate, VehicleType.CAR);
    }
}

export class Bus extends Vehicle {
    constructor(licensePlate: string) {
        super(licensePlate, VehicleType.BUS);
    }
}

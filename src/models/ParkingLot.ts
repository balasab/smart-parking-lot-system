import { Floor } from './Floor.js';
import { Gate } from './Gate.js';

export class ParkingLot {
    private name: string;
    private floors: Floor[];
    private gates: Gate[];

    constructor(name: string, floors: Floor[], gates: Gate[]) {
        this.name = name;
        this.floors = floors;
        this.gates = gates;
    }

    public getName(): string {
        return this.name;
    }

    public getFloors(): Floor[] {
        return this.floors;
    }

    public getGates(): Gate[] {
        return this.gates;
    }

    public getAllSpots(): any[] {
        return this.floors.flatMap(floor => floor.getSpots());
    }
}

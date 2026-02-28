export interface ParkingObserver {
    update(availableSpots: number, floorNumber?: number): void;
}

export class DisplayBoard implements ParkingObserver {
    private id: string;

    constructor(id: string) {
        this.id = id;
    }

    public update(availableSpots: number, floorNumber?: number): void {
        if (floorNumber) {
            console.log(`[DisplayBoard ${this.id}] Floor ${floorNumber} availability updated: ${availableSpots} spots left.`);
        } else {
            console.log(`[DisplayBoard ${this.id}] Total parking lot availability updated: ${availableSpots} spots left.`);
        }
    }
}

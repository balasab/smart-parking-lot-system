import { ParkingLotManager } from './services/ParkingLotManager.js';
import { ParkingSpot } from './models/ParkingSpot.js';
import { ParkingSpotType, VehicleType } from './models/types.js';
import { Motorcycle, Car, Bus } from './models/Vehicle.js';
import { EntryGate, ExitGate } from './models/Gate.js';
import { Floor } from './models/Floor.js';
import { ParkingLot } from './models/ParkingLot.js';
import { DisplayBoard } from './services/Observer.js';

async function main() {
    const manager = ParkingLotManager.getInstance();

    // Initialize with 2 floors
    const floor1Spots = [
        new ParkingSpot('F1-S1', ParkingSpotType.SMALL, 1),
        new ParkingSpot('F1-M1', ParkingSpotType.MEDIUM, 1),
        new ParkingSpot('F1-L1', ParkingSpotType.LARGE, 1),
    ];
    const floor2Spots = [
        new ParkingSpot('F2-S1', ParkingSpotType.SMALL, 2),
        new ParkingSpot('F2-M1', ParkingSpotType.MEDIUM, 2),
    ];

    const floors = [
        new Floor(1, floor1Spots),
        new Floor(2, floor2Spots)
    ];

    const gates = [
        new EntryGate('ENTRY-1'),
        new EntryGate('ENTRY-2'),
        new ExitGate('EXIT-1')
    ];

    const parkingLot = new ParkingLot('Urban Parking', floors, gates);
    manager.initialize(parkingLot);

    // Add a real-time display board
    const board = new DisplayBoard('MAIN-BOARD');
    manager.addObserver(board);

    console.log(`Initial Available Spots: ${manager.getAvailableSpotsCount()}`);
    console.log(`Floor 1 Availability: ${manager.getFloorAvailability(1)}`);
    console.log(`Floor 2 Availability: ${manager.getFloorAvailability(2)}`);

    // Check-in
    console.log('\n--- Checking In ---');
    const v1 = new Motorcycle('ABC-123');
    const t1 = await manager.checkIn(v1, 'ENTRY-1');

    const v2 = new Car('XYZ-789');
    const t2 = await manager.checkIn(v2, 'ENTRY-2');

    const v3 = new Bus('BIG-BUS-1');
    const t3 = await manager.checkIn(v3, 'ENTRY-1');

    console.log(`Available Spots after 3 check-ins: ${manager.getAvailableSpotsCount()}`);
    console.log(`Floor 1 Availability: ${manager.getFloorAvailability(1)}`);
    console.log(`Floor 2 Availability: ${manager.getFloorAvailability(2)}`);

    // Check-out
    console.log('\n--- Checking Out ---');
    if (t1) {
        // Fast forward 2 hours for fee demo
        const entryTime = t1.getEntryTime();
        (t1 as any).entryTime = new Date(entryTime.getTime() - (2 * 60 * 60 * 1000));
        await manager.checkOut(t1.getId(), 'EXIT-1');
    }

    if (t2) {
        // Fast forward 5 hours for fee demo
        const entryTime = t2.getEntryTime();
        (t2 as any).entryTime = new Date(entryTime.getTime() - (5 * 60 * 60 * 1000));
        await manager.checkOut(t2.getId(), 'EXIT-1');
    }

    console.log(`Final Available Spots: ${manager.getAvailableSpotsCount()}`);
    console.log(`Floor 1 Availability: ${manager.getFloorAvailability(1)}`);
    console.log(`Floor 2 Availability: ${manager.getFloorAvailability(2)}`);
}

main().catch(console.error);

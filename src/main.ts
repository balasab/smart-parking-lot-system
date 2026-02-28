import { ParkingLotManager } from './services/ParkingLotManager.js';
import { ParkingSpot } from './models/ParkingSpot.js';
import { ParkingSpotType, VehicleType } from './models/types.js';
import { Motorcycle, Car, Bus } from './models/Vehicle.js';

async function main() {
    const manager = ParkingLotManager.getInstance();

    // Initialize with some spots
    const spots: ParkingSpot[] = [
        new ParkingSpot('S1', ParkingSpotType.SMALL, 1),
        new ParkingSpot('M1', ParkingSpotType.MEDIUM, 1),
        new ParkingSpot('L1', ParkingSpotType.LARGE, 1),
        new ParkingSpot('M2', ParkingSpotType.MEDIUM, 2),
    ];
    manager.initialize(spots);

    // Mock vehicle type storage for demo purposes
    (global as any).vehicleTypeMap = {
        'ABC-123': VehicleType.MOTORCYCLE,
        'XYZ-789': VehicleType.CAR,
        'BIG-BUS-1': VehicleType.BUS,
    };

    console.log(`Initial Available Spots: ${manager.getAvailableSpotsCount()}`);

    // Check-in
    const v1 = new Motorcycle('ABC-123');
    const t1 = await manager.checkIn(v1);

    const v2 = new Car('XYZ-789');
    const t2 = await manager.checkIn(v2);

    const v3 = new Bus('BIG-BUS-1');
    const t3 = await manager.checkIn(v3);

    console.log(`Available Spots after 3 check-ins: ${manager.getAvailableSpotsCount()}`);

    // Attempt to check-in another Bus (no large spots left)
    const v4 = new Bus('BIG-BUS-2');
    await manager.checkIn(v4);

    // Concurrency test: Multiple simultaneous entries
    console.log('\n--- Simulating Concurrent Check-ins ---');
    const v5 = new Car('CONC-1');
    const v6 = new Car('CONC-2');
    (global as any).vehicleTypeMap['CONC-1'] = VehicleType.CAR;
    (global as any).vehicleTypeMap['CONC-2'] = VehicleType.CAR;

    const [tr1, tr2] = await Promise.all([
        manager.checkIn(v5),
        manager.checkIn(v6)
    ]);
    console.log(`Concurrent results: ${tr1 ? 'Success' : 'Failed'}, ${tr2 ? 'Success' : 'Failed'}`);
    console.log(`Available Spots now: ${manager.getAvailableSpotsCount()}`);

    // Check-out
    console.log('\n--- Checking Out ---');
    if (t1) {
        // Fast forward 2 hours for fee demo
        const entryTime = t1.getEntryTime();
        t1['entryTime'] = new Date(entryTime.getTime() - (2 * 60 * 60 * 1000));
        await manager.checkOut(t1.getId());
    }

    if (t2) {
        // Fast forward 5 hours for fee demo
        const entryTime = t2.getEntryTime();
        t2['entryTime'] = new Date(entryTime.getTime() - (5 * 60 * 60 * 1000));
        await manager.checkOut(t2.getId());
    }

    console.log(`Final Available Spots: ${manager.getAvailableSpotsCount()}`);
}

main().catch(console.error);

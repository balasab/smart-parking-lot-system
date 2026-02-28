import { ParkingLot } from '../models/ParkingLot.js';
import { Floor } from '../models/Floor.js';
import { Vehicle } from '../models/Vehicle.js';
import { ParkingTicket } from '../models/ParkingTicket.js';
import { AllocationService } from './AllocationService.js';
import { ParkingFeeStrategy, HourlyFeeStrategy } from './FeeStrategy.js';
import { Mutex } from '../utils/Mutex.js';
import { Gate, EntryGate, ExitGate } from '../models/Gate.js';
import { ParkingObserver } from './Observer.js';

export class ParkingLotManager {
    private static instance: ParkingLotManager;
    private parkingLot?: ParkingLot;
    private activeTickets: Map<string, ParkingTicket> = new Map();
    private completedTickets: Map<string, ParkingTicket> = new Map();
    private feeStrategy: ParkingFeeStrategy;
    private mutex: Mutex = new Mutex();
    private observers: ParkingObserver[] = [];

    private constructor() {
        this.feeStrategy = new HourlyFeeStrategy();
    }

    public static getInstance(): ParkingLotManager {
        if (!ParkingLotManager.instance) {
            ParkingLotManager.instance = new ParkingLotManager();
        }
        return ParkingLotManager.instance;
    }

    public initialize(parkingLot: ParkingLot): void {
        this.parkingLot = parkingLot;
    }

    public addObserver(observer: ParkingObserver): void {
        this.observers.push(observer);
    }

    public notifyObservers(floorNumber?: number): void {
        const totalAvailable = this.getAvailableSpotsCount();
        const floorAvailable = floorNumber ? this.getFloorAvailability(floorNumber) : undefined;

        this.observers.forEach(observer => {
            observer.update(totalAvailable);
            if (floorNumber !== undefined) {
                observer.update(floorAvailable!, floorNumber);
            }
        });
    }

    public async checkIn(vehicle: Vehicle, gateId: string): Promise<ParkingTicket | undefined> {
        if (!this.parkingLot) throw new Error("Parking Lot not initialized");

        const gate = this.parkingLot.getGates().find(g => g.getId() === gateId);
        if (!gate || !(gate instanceof EntryGate)) {
            console.log(`Gate ${gateId} is not a valid Entry Gate`);
            return undefined;
        }

        const release = await this.mutex.lock();
        try {
            const spot = AllocationService.findSpot(this.parkingLot.getAllSpots(), vehicle.getType());
            if (spot) {
                spot.assignVehicle();
                const ticket = new ParkingTicket(
                    `TICKET-${Date.now()}-${vehicle.getLicensePlate()}`,
                    vehicle.getLicensePlate(),
                    vehicle.getType(),
                    spot.getId()
                );
                this.activeTickets.set(ticket.getId(), ticket);
                console.log(`Vehicle ${vehicle.getLicensePlate()} using Gate ${gateId} checked in at floor ${spot.getFloorNumber()} spot ${spot.getId()}`);

                this.notifyObservers(spot.getFloorNumber());
                return ticket;
            }
            console.log(`No available spot for vehicle ${vehicle.getLicensePlate()}`);
            return undefined;
        } finally {
            release();
        }
    }

    public async checkOut(ticketId: string, gateId: string): Promise<ParkingTicket | undefined> {
        if (!this.parkingLot) throw new Error("Parking Lot not initialized");

        const gate = this.parkingLot.getGates().find(g => g.getId() === gateId);
        if (!gate || !(gate instanceof ExitGate)) {
            console.log(`Gate ${gateId} is not a valid Exit Gate`);
            return undefined;
        }

        const release = await this.mutex.lock();
        try {
            const ticket = this.activeTickets.get(ticketId);
            if (!ticket) {
                console.log(`Ticket ${ticketId} not found or already completed`);
                return undefined;
            }

            const spot = this.parkingLot.getAllSpots().find(s => s.getId() === ticket.getSpotId());
            if (spot) {
                spot.removeVehicle();
            }

            const exitTime = new Date();
            const fee = this.feeStrategy.calculateFee(ticket.getEntryTime(), exitTime, ticket.getVehicleType());

            ticket.complete(exitTime, fee);
            this.activeTickets.delete(ticketId);
            this.completedTickets.set(ticketId, ticket);

            console.log(`Vehicle ${ticket.getVehicleLicensePlate()} using Gate ${gateId} checked out from floor ${spot?.getFloorNumber()}. Fee: ${fee}`);

            if (spot) {
                this.notifyObservers(spot.getFloorNumber());
            }
            return ticket;
        } finally {
            release();
        }
    }

    public getAvailableSpotsCount(): number {
        return this.parkingLot?.getAllSpots().filter(s => s.getIsAvailable()).length || 0;
    }

    public getFloorAvailability(floorNumber: number): number {
        const floor = this.parkingLot?.getFloors().find(f => f.getFloorNumber() === floorNumber);
        return floor ? floor.getAvailableSpotsCount() : 0;
    }
}

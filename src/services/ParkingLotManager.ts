import { ParkingSpot } from '../models/ParkingSpot.js';
import { Vehicle } from '../models/Vehicle.js';
import { ParkingTicket } from '../models/ParkingTicket.js';
import { AllocationService } from './AllocationService.js';
import { ParkingFeeStrategy, HourlyFeeStrategy } from './FeeStrategy.js';
import { Mutex } from '../utils/Mutex.js';
import { ParkingTicketStatus } from '../models/types.js';

export class ParkingLotManager {
    private static instance: ParkingLotManager;
    private spots: ParkingSpot[] = [];
    private activeTickets: Map<string, ParkingTicket> = new Map();
    private completedTickets: Map<string, ParkingTicket> = new Map();
    private feeStrategy: ParkingFeeStrategy;
    private mutex: Mutex = new Mutex();

    private constructor() {
        this.feeStrategy = new HourlyFeeStrategy();
    }

    public static getInstance(): ParkingLotManager {
        if (!ParkingLotManager.instance) {
            ParkingLotManager.instance = new ParkingLotManager();
        }
        return ParkingLotManager.instance;
    }

    public initialize(spots: ParkingSpot[]): void {
        this.spots = spots;
    }

    public async checkIn(vehicle: Vehicle): Promise<ParkingTicket | undefined> {
        const release = await this.mutex.lock();
        try {
            const spot = AllocationService.findSpot(this.spots, vehicle.getType());
            if (spot) {
                spot.assignVehicle();
                const ticket = new ParkingTicket(
                    `TICKET-${Date.now()}-${vehicle.getLicensePlate()}`,
                    vehicle.getLicensePlate(),
                    spot.getId()
                );
                this.activeTickets.set(ticket.getId(), ticket);
                console.log(`Vehicle ${vehicle.getLicensePlate()} checked in at spot ${spot.getId()}`);
                return ticket;
            }
            console.log(`No available spot for vehicle ${vehicle.getLicensePlate()}`);
            return undefined;
        } finally {
            release();
        }
    }

    public async checkOut(ticketId: string): Promise<ParkingTicket | undefined> {
        const release = await this.mutex.lock();
        try {
            const ticket = this.activeTickets.get(ticketId);
            if (!ticket) {
                console.log(`Ticket ${ticketId} not found or already completed`);
                return undefined;
            }

            const spot = this.spots.find(s => s.getId() === ticket.getSpotId());
            if (spot) {
                spot.removeVehicle();
            }

            const vehicleType = this.getVehicleTypeFromPlate(ticket.getVehicleLicensePlate());
            const exitTime = new Date();
            const fee = this.feeStrategy.calculateFee(ticket.getEntryTime(), exitTime, vehicleType);

            ticket.complete(exitTime, fee);
            this.activeTickets.delete(ticketId);
            this.completedTickets.set(ticketId, ticket);

            console.log(`Vehicle ${ticket.getVehicleLicensePlate()} checked out. Fee: ${fee}`);
            return ticket;
        } finally {
            release();
        }
    }

    public getAvailableSpotsCount(): number {
        return this.spots.filter(s => s.getIsAvailable()).length;
    }

    // Helper to mock vehicle type from license plate for this logic
    private getVehicleTypeFromPlate(plate: string): any {
        // In a real system, we'd store this in the ticket or a vehicle registry
        // For this demo, let's assume we can infer it or it's stored
        return (global as any).vehicleTypeMap?.[plate] || 'CAR';
    }
}

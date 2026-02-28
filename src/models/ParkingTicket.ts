import { ParkingTicketStatus } from './types.js';

export class ParkingTicket {
    private id: string;
    private vehicleLicensePlate: string;
    private spotId: string;
    private entryTime: Date;
    private exitTime?: Date;
    private fee?: number;
    private status: ParkingTicketStatus;

    constructor(id: string, vehicleLicensePlate: string, spotId: string) {
        this.id = id;
        this.vehicleLicensePlate = vehicleLicensePlate;
        this.spotId = spotId;
        this.entryTime = new Date();
        this.status = ParkingTicketStatus.ACTIVE;
    }

    public complete(exitTime: Date, fee: number): void {
        this.exitTime = exitTime;
        this.fee = fee;
        this.status = ParkingTicketStatus.COMPLETED;
    }

    public getId(): string {
        return this.id;
    }

    public getVehicleLicensePlate(): string {
        return this.vehicleLicensePlate;
    }

    public getSpotId(): string {
        return this.spotId;
    }

    public getEntryTime(): Date {
        return this.entryTime;
    }

    public getExitTime(): Date | undefined {
        return this.exitTime;
    }

    public getFee(): number | undefined {
        return this.fee;
    }

    public getStatus(): ParkingTicketStatus {
        return this.status;
    }
}

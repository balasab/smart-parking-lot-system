export abstract class Gate {
    protected id: string;

    constructor(id: string) {
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }
}

export class EntryGate extends Gate {
    constructor(id: string) {
        super(id);
    }
}

export class ExitGate extends Gate {
    constructor(id: string) {
        super(id);
    }
}

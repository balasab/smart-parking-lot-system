export class Mutex {
    private promise: Promise<void> = Promise.resolve();

    public async lock(): Promise<() => void> {
        let release: () => void;
        const nextPromise = new Promise<void>((resolve) => {
            release = resolve;
        });
        const currentPromise = this.promise;
        this.promise = nextPromise;
        await currentPromise;
        return release!;
    }
}

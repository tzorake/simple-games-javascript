class Observer {
    constructor(observable) {
        this.observable = observable;
    }

    setState(state, callback) {
        const observable = this.observable;

        const [key, value] = [state.key, state.value];

        observable[key] = value;
        console.info(observable);
        console.info(state);
        this.notify(callback);
    }

    getState(state) {
        const observable = this.observable;
        const key = state.key;

        return observable[key]
    }

    notify(callback) {
        const observable = this.observable;

        callback(observable);
    }
}
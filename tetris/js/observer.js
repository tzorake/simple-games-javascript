export { Observer };

class Observer {
    constructor(observable) {
        this.observable = observable;
        this.callbacks = [];
    }

    addState(state, callback) {
        this.callbacks.push({ key: state.key, value : state.value, callback : callback });
    }

    useState(state, callback) {
        const observable = this.observable;

        const [key, value] = [state.key, state.value];

        observable[key] = value;
        // console.info(observable);
        // console.info(state);

        this.notify(callback);
    }

    updateState(state) {
        const observable = this.observable;

        const [key, value] = [state.key, state.value];

        observable[key] = value;
        // console.info(observable);
        // console.info(state);

        const callback = this.findCallback(key, value);
        this.notify(callback);
    }

    findCallback(key, value) {
        const callback = this.callbacks.find(item => item.key === key && item.value === value);
        return callback !== undefined ? callback.callback : () => { };
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
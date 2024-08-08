class DataStore {
    static token: string | null = null;

    constructor() { }

    setItem(key: string, value: string) {
        window.localStorage.setItem(key, value);
        DataStore.token = value
    }

    getItem(key: string): string | null {
        const token = window.localStorage.getItem(key);
        return DataStore.token ?? token
    }

    clear() {
        window.localStorage.clear();
    }
}

export default new DataStore();
// stores the state of the app (user, shopping list, language) in local storage

export class FerggState {
    constructor(public userKey?: string,
                public slistKey?: string) {

    }
}

const localStorageKey = 'fergg';

export class LocalStateService {
    constructor() {
    };

    // ---- localStorage impl -- this doesn't work on Safari in private browser mode ---
    // private static setItemL(item: string) {
    //     localStorage.setItem(localStorageKey, item);
    // }
    //
    // private static getItemL() {
    //     return localStorage.getItem(localStorageKey);
    // }
    //
    // private static deleteItemL() {
    //     localStorage.removeItem(localStorageKey);
    // }

    // ---- Cookie impl ---
    private static setItem(item: string) {
        let d = new Date();
        d.setTime(d.getTime() + (100 * 24 * 60 * 60 * 1000)); // 100 days

        let cookie = localStorageKey + "=" + encodeURIComponent(item) + ";expires=" + d.toUTCString() + ";path=/";
        document.cookie = cookie;
    }

    private static getItem() {
        let name = localStorageKey + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return null;
    }

    private static deleteItem() {
        let cookie = localStorageKey + "=; expires=Sat, 01 Jan 2000 00:00:00 GMT;path=/";
        document.cookie = cookie;
    }

    //------------
    private static putObject(state: FerggState) {
        this.setItem(JSON.stringify(state));
    }

    private static getObject(): FerggState {
        let stateStr = this.getItem();
        if (stateStr) {
            let state: FerggState = JSON.parse(stateStr);
            if (state) {
                return state;
            }
        }
        return new FerggState();
    }

    private static putKV(key: string, val: string) {
        let state: FerggState = this.getObject();
        if (val) {
            state[key] = val;
        } else {
            delete state[key];
        }
        this.putObject(state);
    }

    private static getK(key: string): string {
        let state: FerggState = this.getObject();
        if (state && state[key]) {
            return state[key];
        }
        return null;
    }

    private static deleteK(key: string) {
        let state: FerggState = this.getObject();
        delete state[key];
        this.putObject(state);
    }

    // -----------
    static setSListKey(sListKey: string) {
        this.putKV('slistKey', sListKey);
    }

    static getSListKey(): string {
        return this.getK('slistKey')
    }

    static setUserKey(userKey: string) {
        this.putKV('userKey', userKey);
    }

    static getUserKey(): string {
        return this.getK('userKey')
    }

    static setLanguage(language: string) {
        this.putKV('language', language);
    }

    static getLanguage(): string {
        return this.getK('language')
    }

    static zap() {
        this.deleteItem();
    }
}
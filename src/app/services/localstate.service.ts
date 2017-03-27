// stores the state of the app (user, shopping list) in local storage

export class FerggState {
    constructor(public userKey?: string,
                public slistKey?: string) {

    }
}

const localStorageKey = 'fergg';

export class LocalStateService {
    constructor() {
    };

    // ---- localStorage impl -- this doesn't work on Safari in provate browser mode ---
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
        console.log("setting cookie:"+cookie);
        document.cookie = cookie;
    }

    private static getItem() {
        let name = localStorageKey + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
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
                console.log("LocalStore: get=" + stateStr);
                return state;
            }
        }
        console.log("LocalStore: get=nil, null, nada");
        return null;
    }

    static put(userKey: string, sListKey: string) {
        console.log("LocalStore: u=" + userKey + ", SL=" + sListKey);
        this.putObject(new FerggState(userKey, sListKey));
    }

    static deleteSListKey() {
        let state: FerggState = this.getObject();
        delete state.slistKey;
        this.putObject(state);
    }

    static deleteUserKey() {
        let state: FerggState = this.getObject();
        delete state.userKey;
        this.putObject(state);
    }

    static delete() {
        this.deleteItem();
    }

    static getUserKey(): string {
        let state: FerggState = this.getObject();
        if (state && state.userKey) {
            console.log("LocalStore: get U=" + state.userKey);
            return state.userKey;
        }
        console.log("LocalStore getUserKey: get=nil, null, nada");
        return null;
    }

    static putUserKey(userKey: string) {
        console.log("LocalStore: u=" + userKey);
        let state: FerggState = this.getObject();
        if (!state) {
            state = new FerggState();
        }
        state.userKey = userKey;
        this.putObject(state);
    }

    static getSListKey(): string {
        let state: FerggState = this.getObject();
        if (state && state.slistKey) {
            console.log("LocalStore: get SL=" + state.slistKey);
            return state.slistKey;
        }
        console.log("LocalStore getSlistKey: get=nil, null, nada");
        return null;
    }

    static putSListKey(sListKey: string) {
        let state: FerggState = this.getObject();
        console.log("LocalStore: SL=" + sListKey);
        if (!state) {
            state = new FerggState();
        }
        state.slistKey = sListKey;
        this.putObject(state);
    }
}
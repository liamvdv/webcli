/* + + + Shortcuts + + + */
// Fire with Alt + Shift
function rotateWt(by=1) {
    let wtNum = parseInt(wts.current.id.slice(-1)); // only works for wts.length <= 10
    let to = (wtNum + by) % wts.length;
    wts.changeCurrent(to);
}

// Fire with Alt + <NUM>
function changeWt(to=1) {
    if (to == 0 || to > wts.length) helpConsole.log(`<changeWebtop> ${to} is higher than the number of Webtops you have.`);
    else wts.changeCurrent(to - 1);
}


class HelpConsole {

    get value() {
        return this.el.value;
    }
    set value(v) {
        this.el.value = v;
    }

    constructor() {
        // config?
    }

    domInit() {
        this.el = getEl("#helpConsole");
    }

    log(msg, timeMs=5000) {
        this.value = msg;
        setTimeout(() => {
            if (this.value === msg) this.clear();
        }, timeMs)
    }

    clear() {
        this.value = "";
    }
}

class LocalConfig {
    constructor() {
        this.data = getConfig();
    }

    get(widgetName, wtId=null) {
        if (!wtId) wtId = wts.current.id;

        if (widgetName === "all") return this.data[wtId];
        else return this.data[wtId][widgetName];
    }

    set(widgetName, value, wt=null) {
        if (!wt) wt = wts.current;
        this.data[wt.id][widgetName] = value;
        setConfig(this.data);
    }

    reset() {
        this.data = setConfig(defaultConfig);
    }
}

class WTS {  //el references, wt0, wt1, wt2,...
    constructor() {
        //config?
    }

    domInit() {
        let wts = getEls(".wt");
        wts.forEach(wt => {
            this[wt.id] = wt;
        });
        this.current = wts[0];
        this.length = wts.length;
    }

    changeCurrent(toIdx) {
        if (this.current) this.current.classList.remove("current-wt");

        this.current = this["wt" + toIdx];
        this.current.classList.add("current-wt");
        render(this.current, localConfig.get("all", this.current.id));
    }
}

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

/* + + + Cli + + + */
const cli = {
    init: function() {
        this.el = getSubEl(wts.current, ".searchbar");
        this.history = get("cliHistory") || [];
        this.historyCursor = this.history.length;

        if (this.history.length === 0) {
            helpConsole.log('Hey, you look smart! Type ">help" or hold CTRL + ALT to also be effective.', 10000);
        }
    },
    run: function (inputString) {
        if (inputString[0] === ">") this.handle(inputString.trim().slice(1));
        else runSearchEvent(inputString);
    },
    handle: function (str) {
        if (str === "") return;

        // decompose str to command and its args and call them. 
        this.addToHistory(str);
        let pipeStorage;

        const commandExpressions = str.split("|");

        let command, args, kwargs; 
        commandExpressions.forEach(commandStr => {
            try {
                [command, args, kwargs] = decomposeCommand(commandStr.trim());
                if (pipeStorage !== undefined) kwargs["piped"] = pipeStorage;
                
                commandFunc = commandRegistry[command];
                if (commandFunc) {
                    pipeStorage = commandFunc(args, kwargs);
                } else {
                    this.clear()
                    throw new CommandNotFoundError(`${command} unkown. Type >help or hold CTRL + ALT for help.`)
                }
            } catch (err) {
                if (err instanceof CommandSyntaxError) {
                    return helpConsole.log(err.name + ": " + err.message);
                } else if (err instanceof CommandNotFoundError) {
                    return helpConsole.log(err.name + ": " + err.message);
                } else throw err;
            }
        });
    },
    addToHistory: function(exp) {
        this.history.push(exp);
        if (this.history.length > 10) {
            while(this.history.length > 10) this.history.shift();
        }
        set("cliHistory", this.history);
    },
    showPriorCommand: function(e) {
        e.preventDefault();
        if (this.historyCursor == 0) return helpConsole.log("Reached history end.");

        this.historyCursor--;
        const exp = this.history[this.historyCursor];
        this.el.value = ">" + exp;
    },
    showNextCommand: function (e) {
        e.preventDefault();
        if (this.history.length === 0) return;
        if (this.history.length === 0 ||
            this.historyCursor == this.history.length-1) return helpConsole.log("Reached history start.");

        this.historyCursor++;
        const exp = this.history[this.historyCursor];
        this.el.value = ">" + exp;
    },
    clearHistory: function () {
        set("cliHistory", []);
    },
    clear: function () {
        this.el.value = ">";
    }
}

// What if we make all these commands a object which a helppage and exec attribute?
const commandRegistry = {
    l: function (args, kwargs){
        let url = "http://127.0.0.1:" + args[0]; //port
        runSearchEvent(url, "");
    },
    amz: function (args, kwargs) {
        const searchBaseDE = "https://www.amazon.de/s?k=";

        let searchterm = encodeUrl(args.join(" "));
        let options = "";

        const sort = {
            asc: "&s=price-asc-rank",
            desc: "&s=price-desc-rank",
            new: "&s=date-desc-rank",
            rev: "&s=review-rank"
        }

        if (kwargs.s) options += sort[kwargs.s];
        const searchUrl = searchBaseDE + searchterm + options;
        runSearchEvent(searchUrl, "");
    },
    so: function(args, kwargs) {
        const searchBase = "https://stackoverflow.com/search?q="

        let searchterm = encodeUrl(args.join(" "));
        
        //TODO: add options (flags and kwargs) 

        const searchUrl = searchBase + searchterm;
        runSearchEvent(searchUrl, "");
    },
    gh: function(args, kwargs) {
        // Usage: >gh (got to github)
        // Usage: >gh <searchterm>
        let searchBase = "https://www.github.com/"
        let searchterm = "";
        
        // Check for flags
        if (kwargs.h) return helpConsole.log("Usage: gh [<searchterm>]")

        if (args.length > 0) {
            searchBase += "search?q=";
            searchterm = encodeUrl(args.join(" "));
        }

        const searchUrl = searchBase + searchterm;
        runSearchEvent(searchUrl, "");
    },
    help: function(args, kwargs) {
        const helpPage = "https://www.github.com/Liamvdv/liamvdv.github.io";

        let goTo = "#quick-start"
        if (args.length > 0) {
            if (args.length == 1) goTo = "/blob/master/docs/cli.md#" + args[0];
            else return helpConsole.log("Usage: > help [<command>]");
        }
        const searchUrl = helpPage + goTo;  
        runSearchEvent(searchUrl, "");
    }
}
/* Programm that lets the user set global variables what he can always access */

class CommandSyntaxError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "SyntaxError"
    }
}

class CommandNotFoundError extends Error {
    constructor(msg) {
        super(msg);
        this.name ="CommandNotFoundError"
    }
}

function decomposeCommand(expression) {
    let cmd;
    let args = [];
    let kwargs = [];
    
    let state = {
        priorKw: "",
        kwFlag: false,
        longStrBuffer: "",
        longStrFlag: false,
        addArgBasedOnState: function (value) {
            if (this.kwFlag) {
                kwargs[this.priorKw] = value;
                this.kwFlag = false;
            } else {
                args.push(value);
            }
        },
        resetStrBuffer: function () {
            this.longStrFlag = false;
            this.longStrBuffer = "";
        },
        openBuffer: function (value="") {
            this.longStrFlag = true;
            this.longStrBuffer = value;
        },
        addToBuffer: function (str) {
            if (this.longStrBuffer.length == 0) this.longStrBuffer = str;
            else this.longStrBuffer += " " + str;
        },
        addFlagBasedOnState: function (value) {
            if (this.kwFlag) { // if flag follows after flag, first is flag and not kwarg
                kwargs[this.priorKw] = true;
            } else {
                this.kwFlag = true;
            }
            this.priorKw = value;
        },
        isMissingQuote: function() {
            return this.longStrFlag;
        }
    }

    let someArgs;
    [cmd, ...someArgs] = expression.trim().split(/\s+/);

    let startingQuotes, endingQuotes;
    for (let str of someArgs) {
        startingQuotes = str.startsWith(`"`) || str.startsWith(`'`);
        endingQuotes = str.endsWith(`"`) || str.endsWith(`'`);

        if (startingQuotes && endingQuotes) {
            if (str.length == 1) {
                if (state.longStrFlag) {
                    state.addArgBasedOnState(state.longStrBuffer);
                    state.resetStrBuffer();
                }
                else state.longStrFlag = true;
            } else {
                str = str.substring(1, str.length - 1); // remove quotes
                state.addArgBasedOnState(str);
            }
        } else if (startingQuotes) {
            if (state.longStrFlag) { // long arg
                state.addArgBasedOnState(state.longStrBuffer);
                state.resetStrBuffer();
            } else {
                str = str.slice(1);
                state.openBuffer(str);
            }
        } else if (endingQuotes) {
            if (state.longStrFlag) {
                str = str.substring(0, str.length-1);
                state.addToBuffer(str);
                state.addArgBasedOnState(state.longStrBuffer);
                state.resetStrBuffer();
            } else {
                throw new CommandSyntaxError(`No opening quote / Expects a space before quote.`);
            }
        } else if (state.longStrFlag) {     // whatever is in the quotes, needs to be checked before checking for hythons
            state.addToBuffer(str);

        } else if (str.startsWith("-")) {   // flag or kw
            if (str.length === 1) throw new CommandSyntaxError("Nameless flag. Tip: -FLAGNAME (no space between)");
            str = str.slice(1);
            state.addFlagBasedOnState(str);  

        } else { // arg
            state.addArgBasedOnState(str);
        }
    }
    state.addFlagBasedOnState("");          //flag with no args
    if(state.isMissingQuote()) throw new CommandSyntaxError("Missing closing quotes.");

    return [cmd, args, kwargs];
}

function encodeUrl(str) {
    return encodeURIComponent(str);
}
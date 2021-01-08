/* ERRORS */
class SyntaxError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "SyntaxError"
    }
}

class CommandNotFoundError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "CommandNotFoundError"
    }
}

class SameCommandNameError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "SameCommandNameError";
    }
}

class ArgumentError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "ArgumentError";
    }
}

class KeywordArgumentError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "KeywordArgumentError";
    }
}

class FlagError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "FlagError";
    }
}

class InternalCommandError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InternalCommandError";
    }
}

/* Parent to all Commands - DO NOT INSTANTIATE */
class Command {

    constructor(passedArgs, passedKwargs, passedFlags) {
        this.constructor.allowedFlags.push("piped");
        this.validateArgs(passedArgs);
        this.validateKwargs(passedKwargs);
        this.validateFlags(passedFlags);
        this.args = passedArgs;
        this.kwargs = passedKwargs;
        this.flags = passedFlags;
        this.main(passedArgs, passedKwargs, passedFlags); // entrypoint to user defined cmd behavior
    }

    validateArgs(args) {
        const thiss = this.constructor;
        if (thiss.allowedArgs === true) /* Handle any number of arguments */;
        else if (args.length < thiss.allowedArgs.length) throw new ArgumentError(`${thiss.name} expects ${thiss.allowedArgs.join("+")}.`);
    }

    validateKwargs(kwargs) {
        const thiss = this.constructor;
        const entries = Object.entries(kwargs);
        let k, v, allowedValues;
        for ([k, v] of entries) {
            allowedValues = thiss.allowedKwargs[k];
            if (allowedValues === true) /*do nothing*/;
            else if (allowedValues === undefined) throw new KeywordArgumentError(`${k} is not a keyword to ${thiss.name}.`);
            else if (!allowedValues.includes(v)) throw new KeywordArgumentError(`${v} is not a valid argument to ${k}.`);
        }
    }

    validateFlags(flags) {
        const thiss = this.constructor;
        let f;
        for (f of flags) {
            if (!thiss.allowedFlags.includes(f)) throw new FlagError(`${f} is not a flag to ${thiss.name}.`);
        }
    }

    static hasFlag(flag) {
        return this.allowedFlags.includes(flag);
    }
    static hasKwarg(kw) {
        return this.allowedKwargs[kw] !== undefined;
    }

    hasFlag(flag) {
        return this.flags.includes(flag);
    }

    hasKwarg(kw) {
        return this.kwargs[kw] !== undefined;
    }

    getKwarg(kw) {
        return this.kwargs[kw];
    }
}

/* Handling commands more easily */
class CommandRegistry {
    constructor(...cmdClasses) {
        this.cmds = this.generateKeyFromClasses(cmdClasses);
       
        this.length = cmdClasses.length;
    }

    generateKeyFromClasses(cmdClasses) {
        const cmds = {};
        for (const cls of cmdClasses) {
            cmds[cls.name] = cls;
        }
        return cmds;
    }
    // soly for late binding!!! All standart cmds should be included in initialisation!
    addCommand(cmdCls) {
        let v = this.cmds[cmdCls.name];
        if (v !== undefined && v != cmdCls) throw new SameCommandNameError(`You can not late bind Class ${cmdClass}, because its name is already used by ${v}.`);
        this.cmds[cmdClass.name] = cmdClass; 
    }

    get(cmdStr) {
        const c = this.cmds[cmdStr];
        if (c) return c;
        else throw new CommandNotFoundError(`${cmdStr} unkown. Type >help or hold CTRL + ALT for help.`);
    }
}


/******************************* Custom ***************************************/
/* 
All Commands
Command classes are refered to as exe, while initiated cmd cls are called exec.
! Command classes must start with an oppercase letter to prevent name collisions.

These values will never be read. Use them as a guide.
static name = "cmdName";
static allowedArgs = ["descriptive", "wanted", "args for", "helpConsole"] || true; // allow any length of args
static allowedKwargs = {
    kw1: [
        "option1",
        "option2",
        "option3",
        "option4",
        "option5"
    ],
    kw2: true               // allow all args to kw
}
static allowedFlags = ["f", "mf", "e", "l", "g"];

*/


class Help extends Command{
    static name = "help";
    static allowedArgs = true; // how to show 0 or 1  allowed args ["command"] ?
    static allowedKwargs = {};
    static allowedFlags = [];

    constructor(args, kwargs, flags) {
        super(args, kwargs, flags);
    }
    
    main(args, kwargs, flags) {
        const helpPage = "https://www.github.com/Liamvdv/liamvdv.github.io";

        let goTo = "#quick-start"
        if (args.length > 0) {
            if (args.length == 1) goTo = "/blob/master/docs/cli.md#" + args[0];
            else return helpConsole.log("Usage: >help [<command>]"); // automate with function 
        }
        const searchUrl = helpPage + goTo;  
        runSearchEvent(searchUrl, "");
    }
}

class Get extends Command{
    static name = "get";
    static allowedArgs = ["KEY"];
    static allowedKwargs = {};
    static allowedFlags = ["toBePiped"];

    constructor(args, kwargs, flags) {
        super(args, kwargs, flags);
    }
    
    main(args, kwargs, flags) {
        const STORAGE_KEY = g.config["cliEnvVarKey"];

        const key = args[0];
        let store = get(STORAGE_KEY);

        if (store === null || store[key] === undefined) {
            if (this.hasFlag("toBePiped")) {
                throw new InternalCommandError(`Key ${key} is undefined.`);
            } else {
                helpConsole.log(`${key} is undefined. Use >set <KEY> <VALUE> to set a new variable.`);
            }
        } else {
            if (this.hasFlag("toBePiped")) this.result = store[key];
            else helpConsole.log(`${key} = ${store[key]}`);
        }
    }
}

class Set extends Command{
    static name = "set";
    static allowedArgs = ["KEY", "'VALUE(S)'"]; 
    static allowedKwargs = {};
    static allowedFlags = [];

    constructor(args, kwargs, flags) {
        super(args, kwargs, flags);
    }
    
    main(args, kwargs, flags) {
        // if (args.length < 2) throw new ArgumentError("Expects at least two arguments. Usage: >set <KEY> <VALUE>"); automate that!! (help msg from static attributes)
        const STORAGE_KEY = g.config["cliEnvVarKey"];

        const key = args[0];
        const value = args.slice(1).join(" ");
        let store = get(STORAGE_KEY);   
        if (store !== null) {
            store[key] = value;
            set(STORAGE_KEY, store);
        } else {
            store = {}
            store[key] = value;
            set(STORAGE_KEY, store);
        }
        helpConsole.log("Done.");
    }
}

class Feedback extends Command {
    static name = "feedback";
    static allowedArgs = [];
    static allowedKwargs = {};
    static allowedFlags = [];

    constructor(args, kwargs, flags) {
        super(args, kwargs, flags);
    }
    
    main(args, kwargs, flags) {
        const searchUrl = "https://github.com/Liamvdv/liamvdv.github.io/issues/new";
        runSearchEvent(searchUrl, "");
    }
}

class L extends Command{
    static name = "l";
    static allowedArgs = ["port<int>"];
    static allowedKwargs = {};
    static allowedFlags = ["h"];

    constructor(args, kwargs, flags) {
        super(args, kwargs, flags);
    }
    
    main(args, kwargs, flags) {
        if (this.hasFlag("h")) return helpConsole.log("Usage: >l port"); // automate 
        const url = "http://127.0.0.1:" + args[0];
        runSearchEvent(url, "");
    }
}

class Gh extends Command{
    static name = "gh";
    static allowedArgs = true; // ADDD FEATUUUURE searchterm 0 or more args [searchterm]
    static allowedKwargs = {};
    static allowedFlags = ["h"];

    constructor(args, kwargs, flags) {
        super(args, kwargs, flags);
    }
    
    main(args, kwargs, flags) {
        // Usage: >gh (got to github)
        // Usage: >gh <searchterm>
        let searchBase = "https://www.github.com/"
        let searchterm = "";
        
        // Check for flags
        if (this.hasFlag("h")) return helpConsole.log("Usage: gh [<searchterm>]"); // automate this

        if (args.length > 0) {
            searchBase += "search?q=";
            searchterm = encodeUrl(args.join(" "));
        }

        const searchUrl = searchBase + searchterm;
        runSearchEvent(searchUrl, "");
    }
}

class So extends Command{
    static name = "so";
    static allowedArgs = true; // ADDD FEATUUUURE searchterm 0 or more args [searchterm]
    static allowedKwargs = {};
    static allowedFlags = ["h"];

    constructor(args, kwargs, flags) {
        super(args, kwargs, flags);
    }
    
    main(args, kwargs, flags) {
        const searchBase = "https://stackoverflow.com/search?q="

        if (this.hasFlag("h")) return helpConsole.log("Usage: so [<searchterm>]"); // automate this

        let searchterm = encodeUrl(args.join(" "));

        const searchUrl = searchBase + searchterm;
        runSearchEvent(searchUrl, "");
    }
}

class Amz extends Command{
    static name = "amz";
    static allowedArgs = true;
    static allowedKwargs = {
        s: [
            "asc",
            "desc",
            "rev",
            "new"
        ]
    };
    static allowedFlags = [];

    constructor(args, kwargs, flags) {
        super(args, kwargs, flags);
    }
    
    main(args, kwargs, flags) {
        const searchBaseDE = "https://www.amazon.de/s?k=";

        const sort = {
            asc: "&s=price-asc-rank",
            desc: "&s=price-desc-rank",
            new: "&s=date-desc-rank",
            rev: "&s=review-rank"
        }

        let searchterm = encodeUrl(args.join(" "));
        let options = "";


        if (this.hasKwarg("s")) options += sort[this.kwargs.s];
        const searchUrl = searchBaseDE + searchterm + options;
        runSearchEvent(searchUrl, "");
        this.result = undefined;
    }
}


/* 
Register all commands here be passing their classes as arguments to the constructor.
Singleton.
*/
var commandRegistry = new CommandRegistry(
    Help,
    Get,
    Set,
    Feedback,
    L,
    Gh,
    So,
    Amz
);





/* CLI object */
class CLI {
    constructor() {
        this.config = {
            historyKey: "cliHistory"
        }
        this.history = this.initHistory();
        this.historyCursor = this.history.length;
        this.temp = {};
    }

    domInit() {
        this.el = getEl(".searchbar");
        this.el.addEventListener("input", (e) => {
            
        })
    }

    initHistory() {
        let history = get(this.config.historyKey);
        if (history === null) {
            history = [];
            set(this.config.historyKey, history);
        }
        return history;
    }
    
    get rawValue() {
        return this.el.value;
    }
    set rawValue(v) {
        return this.el.value = v;
    }

    get value() {
        let v = this.el.value;
        return this.isActive() ? v.slice(1).trim() : v;
    }
    set value(v) {
        return this.el.value = `>${v}`;
    }


    run() {
        if (this.isActive()) this.handle(this.value); // trimed
        else runSearchEvent(this.value);
    }

    handle(exp) {
        if (exp === "") return;

        this.addToHistory(exp);

        const expressions = exp.split(/\s*\|\s*/);
        const multipleFlag = expressions.length > 1; let pipeCache;

        let cmd, args, kwargs, flags; 
        expressions.forEach((cmdExp, n) => {
            try {
                [cmd, args, kwargs, flags] = decomposeCommand(cmdExp);

                if (multipleFlag) { // TODO: create unifrom interface for result data
                    if (n === 0) flags.push("toBePiped");
                    else if (n === expressions.length-1) { flags.push("piped"); args.push(...pipeCache); }
                    else { flags.push("piped", "toBePiped"); args.push(...pipeCache); }
                }    

                const exe = commandRegistry.get(cmd);
                const exec = new exe(args, kwargs, flags);

                if (multipleFlag) pipeCache = exec.result;

            } catch (err) {
                if (err instanceof SyntaxError ||
                    err instanceof CommandNotFoundError ||
                    err instanceof ArgumentError ||
                    err instanceof KeywordArgumentError ||
                    err instanceof FlagError) {
                        helpConsole.log(err.name + ": " + err.message, 10000);
                } else if (err instanceof InternalCommandError ||
                           err instanceof SameCommandNameError) {
                    helpConsole.log(`An internal error inside the command occured: ${err.msg}`);
                } else {
                    helpConsole.log("An unexpected Error occured. Type >feedback to report this issue, thank you.")
                    throw err;
                }
            } finally {
                this.clear();
            }
        });
    }


    addToHistory(exp) {
        this.history.push(exp);
        if (this.history.length > 10) {
            while(this.history.length > 10) this.history.shift();
        }
        set(this.config.historyKey, this.history);
    }

    showPriorCommand(e) {
        e.preventDefault();
        if (this.historyCursor == 0) return helpConsole.log("Reached history end.");

        this.historyCursor--;
        const exp = this.history[this.historyCursor];
        this.value = exp;
    }

    showNextCommand(e) {
        e.preventDefault();
        if (this.history.length === 0) return;
        if (this.history.length === 0 ||
            this.historyCursor == this.history.length-1) return helpConsole.log("Reached history start.");

        this.historyCursor++;
        const exp = this.history[this.historyCursor];
        this.value = exp;
    }

    clearHistory() {
        set(this.config.historyKey, []);
    }

    clear() {
        this.el.value = ">";
        this.temp = {};
    }

    isActive() {
        return this.el.value.startsWith(">");
    }

    isFocused() {
        return this.el === document.activeElement;
    }

    cycleKwargs(e) {
        const fromLast = (cmdCls, kw) => {
            if (kw.startsWith("-")) {
                const opt = kw.slice(1);
                if (cmdCls.hasKwarg(opt)) {
                    if (this.temp.kwargCursor === undefined) this.temp.kwargCursor = 0;
                    else if (cmdCls.allowedKwargs[opt] === true) return; // allows any arg to kw, doesn't know which one
                    else this.temp.kwargCursor = (this.temp.kwargCursor +1) % cmdCls.allowedKwargs[opt].length;
                    const kwArg = cmdCls.allowedKwargs[opt][this.temp.kwargCursor];
                    this.value += ` ${kwArg}`;

                } else if (cmdCls.hasFlag(opt)) {
                    helpConsole.log(`${cmdCls.name}'s option -"${opt}" is a flag, not a keyword.`);
    
                } else {
                    helpConsole.log(`${cmdCls.name} doesn't have an option -"${opt}".`)
                }
            }
        };
        const fromSecondLast = (cmdCls, kw, halfArg) => {
            // accounts for user input and trys to fill that up. if it can't it will do nothing.
            const opt = kw.slice(1);
            if (cmdCls.hasKwarg(opt)) {
                if (cmdCls.allowedKwargs[opt] === true) return;  // all args allowd to kw, too many possibilities
                else {
                    if (this.temp.kwargCursor === undefined) { // from halfArgString
                        // const idx = cmdCls.allowedKwargs[opt].findindex((item, idx) => {return item.startsWith(halArg)});
                        // if (idx === -1) return;
                        // else this.temp.kwargsCursor = idx;
                        // this.value = `${cmd} ${options.slice(0, options.length-1).join(" ")} ${cmdCls.allowedKwargs[opt][idx]}`;
                        for (const [idx, allowedArg] of cmdCls.allowedKwargs[opt].entries()) {
                            if (allowedArg.startsWith(halfArg)) {
                                this.temp.kwargCursor = idx;
                                this.value = `${cmd} ${options.slice(0, options.length-1).join(" ")} ${allowedArg}`;
                                break;
                            }
                        }
                    } else { // by cursor
                        this.temp.kwargCursor = (this.temp.kwargCursor +1) % cmdCls.allowedKwargs[opt].length;
                        const kwArg = cmdCls.allowedKwargs[opt][this.temp.kwargCursor];
                        this.value = `${cmdCls.name} ${options.slice(0, options.length-1).join(" ")} ${kwArg}`;
                    }
                }
            }
        };

        e.preventDefault(); // Tab

        let [cmd, ...options] = this.value.split(/\s+/);
        let exe;
        try {
            exe = commandRegistry.get(cmd); 
        } catch (err) {
            console.log(err);
        }

        //TODO: looks at last 2 -> MISSBEHAVES FOR QUOTES
        if (options.length === 0) return;
        else if (options.length === 1) fromLast(exe, options[0]);
        else { // length longer equal 2
            const [ndLast, stLast] = options.slice(options.length -2);

            if (stLast.startsWith("-")) fromLast(exe, stLast);
            else if (ndLast.startsWith("-")) fromSecondLast(exe, ndLast, stLast);
            else return; /* do nothing*/
        } 
    }
}


function decomposeCommand(expression) {
    /* Restriction: Kwargs may not be longer than one argument. Multiple args to a kw must be put in quotes */

    let cmd;
    let args = [];
    let kwargs = {};
    let flags = [];
    
    let state = {
        priorKw: "",
        kwFlag: false,
        longStrBuffer: "",
        longStrFlag: false,
        addArgBasedOnState: function (value) {
            if (value.startsWith("$")) value = new Get([value.slice(1)], {}, ["toBePiped"]).result;

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
        addFlagOrKwBasedOnState: function (value) {
            if (this.kwFlag) flags.push(this.priorKw); // if flag follows after flag, prior is flag
            else this.kwFlag = true;
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
                if (str.includes(`"`) || str.includes(`'`)) {
                    state.addArgBasedOnState(str); // no shortening if passed as argument to sth="abc"
                }
                else throw new SyntaxError(`No opening quote / Expects a space before quote.`);
            }
        } else if (state.longStrFlag) {     // whatever is in the quotes, needs to be checked before checking for hythons
            state.addToBuffer(str);

        } else if (str.startsWith("-")) {   // flag or kw
            if (str.length === 1) throw new SyntaxError("Nameless flag. Tip: -FLAGNAME (no space between)");
            str = str.slice(1);
            state.addFlagOrKwBasedOnState(str);  

        } else { // arg
            state.addArgBasedOnState(str);
        }
    }
    state.addFlagOrKwBasedOnState(); // flag 
    if(state.isMissingQuote()) throw new SyntaxError("Missing closing quotes.");

    return [cmd, args, kwargs, flags];
}
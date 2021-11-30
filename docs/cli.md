# A searchbar
Search the web as you normally do. Choose your favorite search engine from 
- [Google](https://www.google.com/search)
- [DuckDuckGo](https://www.duckduckgo.com)
- [Ecosia](https://www.ecosia.org/search)
- [Bing](https://www.bing.com/search)
The default search engine is Google.

# ... on steroids
This searchbar turns into everything you want as soon as you type : (colon).
Below you will see some preimplemented commands. If you are missing one, go [here](#Custom-Commands) to learn how to implement your own!
Usage: 
```
: <command> <args> [<flags>] [<kw> <kwArg>]
```
You can even go through your last command history with ArrowUp and ArrowDown, just like in the real commandline. The last 10 commands are stored.  
Arguments to a command must be provided. Flags and keyword-arguments can modify the commands behaviour. A keyword only takes one argument.

Arguments are always space separated. If a command or keyword expects multiple words as one argument, put these words in quotes `"" or ''` and they will be parsed as one argument.

You may access custom environment variables by prefixing them with the dollar sign `$<name>`.
Example:
```
:set WISHLIST "Brooks Ghost 13 running shoes men"
:amz $WISHLIST -s asc
```
Where we set the key `WISHLIST` equal to `"Brooks Ghost 13 running shoes men"` with [set](#set).
Then we run the [amz](#amz) command to search Amazon for the shoes and filter by ascending prices. 

## help
Get to the documentation page of a command.
Usage: 
```
:help <command>
```
## set
Set environment variables just like in the real terminal.
Usage:
```
:set <KEY> <VALUE>
```
Note: Keys must not include spaces. If the value is one word no quotes are required, else you must provide quotes.

## get
Get your custom set environment variables.
Usage:
```
:get <KEY>
:$<KEY>     # pass value as argument to another function.
```
The dollar sign syntax is very handy for long repeating (keyword-) arguments to other commands.

## l
Quickly get to your test server running on localhost (127.0.0.1).
Usage:
```
:l <port>
```  

## gh
Open and search GitHub directly from your CLI.
```
:gh [<searchterm>]
```
The __gh__ command supports the _h_ flag to get some knowledge on how to use it from the [helpConsole](widgets.md#helpConsole). 

## so
Search StackOverflow directly from your Webtop.
```
:so <question>
```
Does not currently support any other flags or kwargs. 

## amz
Search Amazon directly from your Webtop.
```
:amz <searchterm> [options]
```
The _amz_ command supports the sorted by kwarg. Four types are supported:
- asc (ascending price)
- desc (descending price)
- rev (by reviews)
- new (by newest)
Usage:
```
: amz <searchterm> -s <type>
: amz blue shirt men -s asc
```

## trans
Translate any sentence with [Linguee](https://www.linguee.com/). By default it will translate from english to german. You can modify both with keyword-arguments: From `-f <language>`; To `-t <language>`.
Usage:  
```
:trans <searchterm> [-f <lang>] [-t <lang>]
```

Example 1: Translate the english word `enormity` to german:
```
:trans enormity
```
Example 2: Translate english `sun creme` to italian:
```
:trans sun creme -t italian
```
Example 3: Translate italian `bella ragazza` to english:
```
:trans bella ragazza -f italian -t english
```

## go
Quickly lookup the Golang [standard library](https://golang.org/pkg).
Usage:
```
:go <pkg import path> [-var] [-const] [-f <func name>] [-t <type name>]
```
The _go_ command allows you to quickly get exactly where you want to be, to help with that, you can choose exactly one of the available flags and keyword arguments.  
If you want to go to the page of the `io/fs` package, type:
```
:go io/fs
```
If you want to check the errors functions in `io/fs` return, but you forget the name, just list the variables with the `-var` flag.
```
:go io/fs -var
```
Same applies to `-const` flag. This may be helpful if you forgot which options you can pass to `os.OpenFile()`, because these enums are typically implemented as constants. So, to make sure that it was `os.O_TRUNC` and not `os.O_TRUN`, go to the docs with:
```
:go os -const
```
You can also look up a certain type or function directly by providing its identifier with the `-f` (think function) and `-t` (think type) keyword arguments.
For example, lets look up the `io.RuneScanner` interface, which we want our type to implement:
```
:go io -t RuneScanner
```

## §
Look up German laws directly from your Webtop with the help of [gesetze-im-internet.de](https://www.gesetze-im-internet.de/). 
```
:§ <article> <abbreviated lawbook>
```

Statements classified as hate speech are not protected by freedom of speech. To see why, let's take a look at Article 5 in Germany's basic law call *Grundgesetz*. 
```
:§ 5 GG
```
The implications of (2) are further quantified in other parts of German law. For example, publicly sharing symbols of unconstitutional organisations is considered an offense § 86a StGB.
```
:§ 86a StGB
```

## feedback
A quick way to open a new issue on GitHub. Please use it you are
- experiencing unexpected behaviour
- asked to report an uncaught error by the software
- a genius and have a great idea or need for a feature
A minute of your time helps this project progress by hours. Thank you.


## Custom commands
You've read corrently! You can make your own commands and host them on your own GitHub pages or make a pull request.
Commands are basically Classes that have a name, take in an array of arguments, an array of flags and an object called kwargs, short for keyword-arguments. They are all registered in the [commandRegistry object](cli.js).
Arguments following a command will be split on space and added to the args array. They must be provided.
```
:commmand arg1 arg2 arg3 ...
:help <command>
:help amz   # go the the amz documentation
```
Flags can be set after the arguments and take no argument. 
```
:command somearg -flag1 -flag2 -flag3 -flag4
:gh <flag>
:gh -h      # help flag, returns a usage message
```
Keyword-arguments are like flags, but are followd by one argument belonging to it. 
```
:command somearg -kw arg -kw "long arg with multiple words"
:amz <searchterm> <kwarg>
:amz AirPods 2nd Generation -s asc
```
Note: Press `TAB` to autocomplete an argument to a keyword and go through the different possibilities.

#### Custom command tutorial
All your code is bundeled in a command class, which will be instantiated when called. The constructor is called with three arguments. 
```javascript
executingCommand = new cmdClass(args, kwargs, flags);
```
**Args is an array** of arguments passed by the user after the command. **Kwargs is an object** with holds the keyword arguments as its properties `{ kw: arg }`. If a keyword is set multiple times in a command expression, only the last argument will get passed, as the others will get overwritten. **Flags is an array** of strings, containing the set flag names (not the dash `-`).
To get a better understanding of how to use what when, we will build a simple js evaluation application called **js**.
We will print the value to our [helpConsole](widgets.md#helpConsole) for 5 seconds, which are 5000 milliseconds. 
First, we will out the basic command template. 
Note: The command's name is set in the `static name` attribute. The class name **must** start with a capital letter.
```javascript
class Js extends Command{
    static name = "js";
    static allowedArgs = true;
    static allowedKwargs = {};
    static allowedFlags = ["toBePiped"];

    constructor(args, kwargs, flags) {
        super(args, kwargs, flags);
    }
    
    /*
    The main application logic sits in the method main. The name is required by the system.
    */
    main(args, kwargs, flags) {
        /*
        Our command code.
        */
        ;
    }
}
```
The system requires `Js` to allways have 5 attributes, four of which must be static. The allowed... properties will be used by the system to autocomplete user input and perform automatic checks, so you don't have to!
`static name` is a string and the call name of your program.
`static allowedArgs` can either be an array or boolean `true`. The array length will be used by the default validators to ensure the right argument count is handed over. Else it can build a help message from the elements in the array. If your command accepts a variable length of arguments, please set the field to `true` and do your own validation.
`static allowedKwargs` is an object and contains all the allowed keywords as properties. If any argument can be passed set the value to true, else provide an array of strings of possible argumentds. This also enables the system to autocomplete the users input.
`static alledFlags` is an array and contains all the possible flags as strings (**without** dashes). If your command's result can be piped to other commands, you can show that to the system by adding `toBePiped` to the allowed flags. The system will look under the `cmdInstance.result` attribute for the data.

The system will then - after validating the arguments - call the main method. This is the main entrypoint for your programm. I should note that all values are parsed as strings.

Here is a short overview of the provided functions:
```javascript
this.hasFlag(flag)  // returns true or false
this.hasKwarg(kw)   // returns true or false
this.getKwarg(kw)   // returns a string (or undefined)
```

So lets now focus on our js command's main function.
```javascript
//...
main(args, kwargs, flags) {
    const input = args.join(" ");
    const res = eval(input);
    if (this.hasFlag("toBePiped")) this.result = res;
    else return helpConsole.log(res, 5000);
}
```
To let your system know that your command exists we must add the class to the `commandRegistry`.
In [cli.js](cli.js):
```javascript
var commandRegistry = new CommandRegistry(
    Help,
    /* ... */
    Js
);
```

We can now use this ~~dangerous~~ *save* code to run JavaScript from our cli, which we could totally not do with the web console... 
Example:
```
: js alert("Why do Pythons live on land? Because they are above C-level.");
```
I hope that this code hasn't ran in your Browser, your security policy should prohibit programmers running the insecure function _eval_ with user input anyway, but it gave you a good starting point. Learn more about the dangers [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval).

## Comprehension
A command is registered in the commandRegistry object. It is a class that inherits from `Command`. It must have the static attributes `name, allowedArgs, allowedKwargs, allowedFlags` and the entrypoint `main()` function.
All values are string values and values to attributes which were declared with `true` are not garanteed. It is your job to handle missing values and type casting.
Mutiple words in quotes are treated as one argument.
If a command is going to be piped to another command, it must except the `toBePiped` flag. It is expected that no user-visible console logging is used and instead the return value is placed under `this.result`.
If the `toBePiped` flag is set, you must raise the [InternalCommandError](). If any other problem arised, throw an descriptive error. Here you can see all important custom errors. Feel free to create your own:
- [InternalCommandError](cli.md)
- [ArgumentError](cli.md)
- [KeywordArgumentError](cli.md)
- [FlagError](cli.md)

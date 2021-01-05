# A searchbar
Search the web as you normally do. Choose your favorite search engine from 
- [Google](https://www.google.com/search)
- [DuckDuckGo](https://www.duckduckgo.com)
- [Ecosia](https://www.ecosia.org/search)
- [Bing](https://www.bing.com/search)
The default search engine is Google.

# ... on steriods
This searchbar turns into everything you want as soon as you type > (greater than sign).
Below you will see some preimplemented commands. If you are missing one, just create your own function for it. See [here](#Custom-Commands)
Usage: 
```
> <command> [<args> <flags> <kwargFlag> <kwarg>]
```
You can even go through your last command history with ArrowUp and ArrowDown, just like in the real commandline. The last 10 commands are stored.  
Arguments to a command must be provided. Flags and keyword-arguments can modify the commands behaviour.
Arguments are always space seperated. If a command expects multiple words as one argument, put these words in quotes ("" or '') and they will be parsed as one argument.

You may access custom environment variables by prefixing them with the dollar sign ($).
Example:
```
>set WISHLIST Brooks Ghost 13 running shoes men
>amz $WISHLIST -s asc
```
Where we set the key "WISHLIST" equal to "Brooks Ghost 13 running shoes men" with [set](#set).
Then we run the [amz](#amz) command to search Amazon by ascending prices after "Brooks Ghost 13 running shoes men". 

## help
Get to the documentation page of a command.
Usage: 
```
> help <command>
```
## set
Set environment variables just like in the real terminal.
Usage:
```
>set <KEY> <VALUES...>
```
Note: Keys must not include spaces. The value will be one or more words. You can optionally put them in quotes.

## get
Get your custom set environment variables.
Usage:
```
>get <KEY>
>$<KEY>     # pass value as argument to another function.
```
The dollar sign syntax is very handy for long repeating (keyword-) arguments to other commands.

## l
Quickly get to your test server running on localhost (127.0.0.1).
```
> l <port>
```  

## gh
Open and search GitHub directly from your CLI.
```
> gh [<searchterm>]
```
The __gh__ command supports the _h_ flag to get some knowledge on how to use it from the [helpConsole](widgets.md#helpConsole). 

## so
Search StackOverflow directly from your Webtop.
```
> so <question>
```
Does not currently support any other flags or kwargs. 

## amz
Search Amazon directly from your Webtop.
```
> amz <searchterm>
```
The _amz_ command supports the sorted by kwarg. Four types are supported:
- asc (ascending price)
- desc (descending price)
- rev (by reviews)
- new (by newest)
Usage:
```
> amz <searchterm> -s <type>
> amz blue shirt men -s asc
```
## feedback
A quick way to open a new issue on GitHub. Please use it you are
- experiencing unexpected behaviour
- asked to report an uncaught error by the software
- a genius and have a great idea or need for a feature
A minute of your time helps this project progress by hours. 

## Custom commands
You've read corrently! You can make your own commands and host them on your own GitHub pages or make a pull request.
Commands are basically functions that have a name, take in an array of arguments and an object called kwargs, short for keyword-arguments. They are all registered in the [commandRegistry object](shortcuts.js).
Arguments following a command will be split on space and added to the args array. 
Flags can be given after the arguments and take no further argument.
```
> gh -h
``` 
h is the help flag for the [GitHub](#gh) command. The gh function will execute the following:
```javascript
// args = [], kwargs = { h: true }
gh: function(args, kwargs) {
    // ...
    if (kwarg.h) return helpConsole.log("Usage: > gh [<searchterm>]");
    // ...
}
```
Learn more about the **helpConsole** [here](widgets.md#helpConsole).
Keyword-arguments are like flags, but followd by one argument belonging to it. 
```
> amz orange striped socks -s asc 
```
s is the kwarg for sorting the results and takes as an argument asc for ascending. The amz function will intern handle it like this:
```javascript
// args = [orange, striped, socks], kwargs = { s: asc } 
amz: function(args, kwargs) {
    const searchBaseDE = "https://www.amazon.de/s?k=";
    let searchterm = encodeUrl(args.join(" "));

    const sort = { asc: "&s=price-asc-rank" };
    if (kwargs.s) searchterm += sort[kwargs.s];

    const searchUrl = searchBaseDE + searchterm;
    runSearchEvent(searchUrl, "");
}
```
#### Custom command tutorial
To get a better understanding of how to use what when, we will build a simple js evaluation application called **js**.
You can write the function somewhere else or directly in the custom command object, like we will do. As explained above, all commands get an args array and a kwargs object containing kwargs and flags. We will print the value to our [helpConsole](widgets.md#helpConsole) for 5 seconds, which are 5000 milliseconds. 

```javascript
const commandRegistry = {
    //...
    js: function(args, kwargs) {
        const input = args.join(" ");
        const res = eval(input);
        return helpConsole.log(res, 5000);
    }
}

```
We can now use this ~~dangerous~~ *save* code to run JavaScript from our cli, which we could totally not do with the web console... 
Example:
```
> js alert("Why do Pythons live on land? Because they are above C-level.");
```
I hope that this code hasn't ran in your Browser, your security policy should prohibit programmers running the insecure function _eval_ with user input! Learn more about the dangers [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval).

## Comprehension
A command is registered in the commandRegistry object. The property name will be the call name. The function will be provided with two arguments, `args` and `kwargs`. 
`args` is an array of strings containing the arguments to the command. 
`kwargs` contains all flags and keyword-arguments passed by the user. Flags are properties of `kwargs` with the value `true`. A keyword-argument has the value passed to it as its value instead of `true`. 
All values are string values and no value is garanteed. It is your job to handle missing values and type casting.
Mutiple words in quotes are treated as one argument.
If a command is going to be piped to another command, it will be called with the `toBePiped` flag. It is expected that no user-visible console logging is used and instead the return value contains the data. If data will be piped into a command, the `pipe` keyword-argument will contain the values.
If the user is missing arguments or parsing wrong keyword-arguments, throw an error. It will be handeled by the API. If the toBePiped flag is set, you must raise the [InternalCommandError](). Here you can see all important errors:
- [InternalCommandError]()
- [ArgumentError]()
- [KeywordArgumentError]()

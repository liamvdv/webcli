# A searchbar
Search the web as you normally do. Choose your favorite search engine from 
- [Google](https://www.google.com/search)
- [DuckDuckGo](https://www.duckduckgo.com)
- [Ecosia](https://www.ecosia.org/search)
- [Bing](https://www.bing.com/search)
The default search engine is Google.

# ... on steriods
This searchbar turns into everything you want as soon as you type > (greater than sign).
Blow you will the preimplemented commands. If you are missing one, just create your own function for it. More details on will follow soon.
Usage: 
```
> <command> [<args> <flags> <kwargFlag> <kwarg>]
```
You can even go through your last command history with ArrowUp and ArrowDown, just like in the real commandline. The last 10 commands are stored.  

## help
Get to the documentation page of a command.
Usage: 
```
> help <command>
```
## so
Search StackOverflow directly from your Webtop.
```
> so <question>
```
Does not currently support any other flags or kwargs. 
## l
Quickly get to your test server running on localhost (127.0.0.1).
```
> l <port>
```  
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

## gh
Open and search GitHub directly from your CLI.
```
> gh [<searchterm>]
```
The __gh__ command supports the _h_ flag to get some knowledge on how to use it from the [helpConsole](widgets.md#helpConsole). 

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
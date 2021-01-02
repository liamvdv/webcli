# A Searchbar
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

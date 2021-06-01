# Webtops
Webtop are desktops in your browser, that help you navigate the web.
Custom [Widgets](#Widgets) allow you to gather all the information you want in one place and
quickly navigate them with [Shortcuts](#Shortcuts) and it's custom [CLI](#CLI).
[Check it out](https://liamvdv.github.io)!

## Quick-Start🚀
Your Webtops have three unique features: [Shortcuts](docs/shortcuts.md), the [CLI](docs/cli.md) and [Widgets](docs/widgets.md). The special part: The ready-made ones are fully customisable and you can add your own widgets and commands.
The following gives you a quick overview of how to get started with your own Webtop.

Hold `CTRL + ALT` to access the help page.
Rotate to the next Webtop with `ALT + SHIFT` or jump directly to one by pressing `ALT + DIGIT`.

The CLI gets activated by typing ":" into the searchbar.
From there on you have access to a range of commands. Here are some examples:
Search [StackOverflow](https://stackoverflow.com/) for a question with **so**:
```
: so check if a str is numeric
```
Set environment variables just as in the terminal with **set**:
```
: set PRESENT "The Ruins of Gorlan"
``` 
Search [Amazon](https://amazon.com/) for book with asc prices with the **amz** command:
```
: amz $PRESENT -s asc
```
Open your localhost (127.0.0.1) on port 8080 with **l**:
```
: l 8080
```
To see all commands go [here](docs/cli.md) or type into your Webtop CLI:
```
: help <command>
```
[Try it out!](https://liamvdv.github.io)

## Installation
If your are like me and open your browser frequently, you really come to appreciate a webtop. They are ment to open everytime you open your browser and will configure themselves from [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
In Firefox: type __about:preferences#home__ > Page > dropdown select user-defined address > type https://liamvdv.github.io > close Firefox > reopen and enjoy!

### CLI
Add your custom commands by cloning this project and just adding a function.
Currently supported commands:

- [help](docs/cli.md#help)
- [set](docs/cli.md#set)
- [get](docs/cli.md#get)
- [l](docs/cli.md#l)
- [gh](docs/cli.md#gh)
- [so](docs/cli.md#so)
- [amz](docs/cli.md#amz)
- [go](docs/cli.md#go)
- [feedback](docs/cli.md#feedback)


### Shortcuts
Navigate the web without touching your mouse once. [Learn more](docs/shortcuts.md).

### Widgets
Widgets allow you to customise the presented graphical interface. The main advantage of a web CLI is the easy access to APIs and a graphical prepresentation of their data if you choose so. [Learn more](docs/widgets.md).  


#### Notes
This Porject is fully build in vanilla JS. I appreciate all feedback and will happily listen to your wishes and needs. 
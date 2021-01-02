# Webtops
Webtop are desktops in your browser, that help you navigate the web.
Custom [Widgets](#Widgets) allow you to gather all the information you want in one place and
quickly navigate them with [Shortcuts](#Shortcuts) and it's custom [CLI](#CLI).
[Check it out](https://liamvdv.github.io)!

## Quick-Start🚀
Your Webtops have three unique features: [Shortcuts](docs/shortcuts.md), the [CLI](docs/cli.md) and [Widgets](docs/widgets.md). The special part: The ready-made ones are fully customisable and you can add your own widgets and commands.
The following gives you a quick overview of how to get started with your own Webtop.

The two most important shortcuts are the following, which allow you to change between your Webtops. 
```
ALT + SHIFT # rotate to the next Webtop
ALT + DIGIT # go to Webtop 1 or 2 or 3
```

The CLI gets activated by typing ">" into the searchbar.
From there on you have access to a range of commands. Here are some examples:
Search [StackOverflow](https://stackoverflow.com/) for a question with **so**:
```
> so check if a str is numeric
```
Search [Amazon](https://amazon.com/) for kitchen magnets with ascending prices with the **amz** command:
```
> amz kitchen magnets -s asc
```
Open your localhost (127.0.0.1) on port 8080 with **l**:
```
> l 8080
```
To see all commands go [here](docs/cli.md) or type into your Webtop CLI:
```
> help <command>
```
[Try it out!](https://liamvdv.github.io)

## Installation
If your are like me and open your browser frequently, you really come to appreciate a webtop. They are ment to open everytime you open your browser and will configure themselves from [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
In Firefox: type __about:preferences#home__ > Page > dropdown select user-defined address > type https://liamvdv.github.io > close Firefox > reopen and enjoy!

### CLI
Add your custom commands by cloning this project and just adding a function. More on that in future documentation.
Currently supported commands:

- [help](docs/cli.md#help)
- [amz](docs/cli.md#amz)
- [so](docs/cli.md#so)
- [l](docs/cli.md#l)

### Shortcuts
Navigate the web without touching your mouse once. [Learn more](docs/shortcuts.md)

### Widgets
Coming soon with full power!


### Notes
This project is still a prototype and is missing some core functionality. Shadows only work properly on Firefox. If you have any thoughts please let me know. 
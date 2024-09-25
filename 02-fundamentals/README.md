# POSIX Fundamentals

[lecture slides](./slides.md)

Your second week is focused on getting you familiar with the common features of
the UNIX system environment. While sometimes arcane, these features are an
interface to extremely powerful and important tools, underlying a lot of modern
development. You will be learning to understand the shell itself, the
composability of UNIX commands through pipes, and the user and group permissions
that govern access to files, directories and executables. 

A common issue at this stage of the unit is students stumbling over some aspect
of 'where' they are in their filesystem, or 'who' they are when executing
commands. These are very important, so learn to pay attention to what the shell
is telling you. 

## Pre-reading

There are some substantial topics to introduce here, so there's a lot of
material we're explaining in advance. We don't advise watching all of this in
one go -- instead, watch the videos on a topic and then look ahead at the
corresponding exercise to see if you understand how to apply it. It's also a
good idea to break your preparation up into two or three sesssions.

| Video | Length | Slides |
|-------|-------:|--------|
| [The shell](https://web.microsoftstream.com/video/a55ff501-9e8d-4bb3-a00e-b680596b2de3) | 30 minutes | [slides](./shell.pdf) |
| [Permissions](https://web.microsoftstream.com/video/71b186df-c373-4b98-ba34-035679cb1ec6) | 20 minutes | [slides](./permissions.pdf) |
| [Shell scripting 1](https://web.microsoftstream.com/video/bbe017bf-c1b6-44a0-96cf-ef79a9b17f0e) | 17 minutes |  [slides](./scripting_1.pdf) |
| [Shell scripting 2](https://web.microsoftstream.com/video/0a2a65bc-1655-4089-984f-53c9400dc2d3) | 21 minutes |  [slides](./scripting_2.pdf) |
| [Pipes 1](https://web.microsoftstream.com/video/7b2657a6-a2d4-4c34-a642-da993d468851) | 20 minutes |  [slides](./pipes_1.pdf) |
| [Pipes 2](https://web.microsoftstream.com/video/d04fb18c-533b-4ffe-b8a1-f4d46e9b73d1) | 30 minutes |  [slides](./pipes_2.pdf) |

## Exercises

1. [Shell expansion](./lab/shell.md)
2. [File permissions](./lab/permissions.md)
3. [Shell scripting](./lab/script.md)
4. [Pipes](./lab/pipes.md)

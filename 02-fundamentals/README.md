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
| [The shell](https://uob-my.sharepoint.com/:v:/g/personal/me17847_bristol_ac_uk/EY8ZpcyoGAtWO3aawAKNU2oB_n6dVthH_xcc8s9luWIMkA?e=81llEs) | 30 minutes | [slides](./shell.pdf) |
| [Permissions](https://github.com/cs-uob/software-tools/raw/refs/heads/main/%3F%3F-covid-era-videos/Permissions.mp4) | 20 minutes | [slides](./permissions.pdf) |
| [Shell scripting 1](https://github.com/cs-uob/software-tools/raw/refs/heads/main/%3F%3F-covid-era-videos/Shellscripting%201.mp4) | 17 minutes |  [slides](./scripting_1.pdf) |
| [Shell scripting 2](https://github.com/cs-uob/software-tools/raw/refs/heads/main/%3F%3F-covid-era-videos/Shellscripting%202.mp4) | 21 minutes |  [slides](./scripting_2.pdf) |
| [Pipes 1](https://uob-my.sharepoint.com/:v:/g/personal/me17847_bristol_ac_uk/EZm4VjMtQihVAa_kvFhIcnMBvus90Xb4Ebq23jdLp9sBTg?e=zP6Q4X) | 20 minutes |  [slides](./pipes_1.pdf) |
| [Pipes 2](https://uob-my.sharepoint.com/:v:/g/personal/me17847_bristol_ac_uk/EcKphM_jph5R5HV0NoVhy8IBY3FsqVwjlgO5n_iUJehBag?e=QuoASU) | 30 minutes |  [slides](./pipes_2.pdf) |

## Exercises

1. [Shell expansion](./lab/shell.md)
2. [File permissions](./lab/permissions.md)
3. [Shell scripting](./lab/script.md)
4. [Pipes](./lab/pipes.md)

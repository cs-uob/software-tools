# Software Tools
(COMS10012 / COMSM0085)

# Week 2: Getting Familiar with the Commandline

Warning: a lot more pre-reading (watching) this week.

### Workbook 2: POSIX Fundamentals 
(or, "The Rabbithole Keeps Getting Deeper")
- Understanding program arguments and shell variables.
- File permissions, file ownership and group membership.
- Writing shellscripts to simplify tasks.
- Pipes, and why plumbing is key to effective shell usage.

---

## But First...

Issues and topics from last week's lab:

1. "What is a text editor?"
2. Diagnose this `cp` problem...
3. Vagrant on Apple Silicon
4. Multiuser systems


---

## Workbook 2 Preview: Tools, Arguments and Options

Look at the `man` page for `ssh`, or `chmod`.

Sidenote: What are manpages?

`chmod [OPTION]... MODE[,MODE]... FILE...`

What does this all mean?

Why is `uname-a` not the same as `uname -a`?

`cp thisfile thatfile`

`cp this file that file`


---

## Workbook 2 Preview: File Permissions

You've already been introduced to `ls -l` as a 'long' listing of a directory.

But what does all the output mean?

`user user`

Key concept: a file has a specfic owner, and belongs to a group.

All permissions are set for for 'user', 'group' and 'other'.

`-rwxrwxrwx`

What you can do to a file depends on: 
    (a) the permissions set on that file 
    (b) which user you are

---

## Workbook 2 Preview: Shell Scripting

The shell you are using... is actually an interface to a programming language.

Variable assignment:
```bash
VAR=value
echo "I $VAR this example"
```

Loops:
```bash
for i in $(seq 1 10);
do
    echo $i
done
```

---

## Workbook 2 Preview: Shell Scripting

Substring selection:
```bash
VAR=value.txt
echo "I ${VAR%.*} this example"
echo "I ${VAR#*.} this example"
```

Branching (if statement):
```bash
if [ $(whoami) = 'root' ]; then
    echo "You are root"
else
    echo "You are not root"
fi
```

More language basics in pre-reading.

---

## Workbook 2 Preview: Pipes

Using shell scripting, you can write programs that use Unix utilities as
components, and process their output programmatically. 

But there are often quicker ways.

Unix tools are designed to be _interoperable_ using the common medium of _text_ 
(technically: a stream of bytes). 

Each tool is designed to _do one thing well_. Behaviour can be controlled
through _options_, and output from one tool can be _redirected_ as the input to
another.

Some simple examples...

---
## The End

We'll see you on Friday.

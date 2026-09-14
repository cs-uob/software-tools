# Software Tools
(COMS10012 / COMSM0085)

## Week 7: Debugging
(or, "Peeling the face off the shoggoth")
 - Debugging vs Testing
 - `strace`
 - `valgrind`
 - `gdb`

---

## But first...

Questions about testing?

---

## Testing vs Debugging

Testing tells you that there is a problem with your code.

(Noticing this is important).

Debugging is about finding out _why_ there is a problem.

(This is much harder).

"I know `calculate('2.9 ^ 3')` _shouldn't_ return '27', but I don't know why it _is_ doing that." 

---

## Debugging strategies

By this point in your studies, you have probably developed some strategies for
finding out where your logic has gone wrong. 

 - Running the code 'in your head' carefully.
 - Rubber-duck debugging. 
 - Checking values with `print` statements.
 - Use of `assert` to check assumptions.

---

## Debugging tools

We are going to introduce you to some tools that allow you to debug programs
_even without access to the source code_. 

Specifically, tools that address three different classes of issue:

  - "I don't really understand what this program is doing in my system when I run it."
  - "This program is much slower / uses more memory than I expected."
  - "This program is not behaving the way it is supposed to."

---

## strace

The 'what do you do?' tool.

`strace [command]` runs the command until it exits. While the process is
running, `strace` intercepts and displays _system calls_ made by the process.

(_system calls_: calls to basic OS functions)

This allows you to understand the basic actions being taken by a process.

```bash
strace ls
```

---

## Important strace options

Various options allow you to control output formatting, or handle how `strace`
should deal with processes that spawn child processes. Two important options to
understand:

1. The `-e` option lets you identify only specific system calls you are
   interested in.

```
strace -e open,openat ls
```

2. The `-p` option allows you to attach strace to an _already running_ process. 

```
ps aux | grep [name]
strace -p [pid]
```
---

## Beyond system calls

Sometimes understanding a program requires a higher level of abstraction than
just looking at the OS-level system calls. 

Maybe you want `strace`, but for _all_ library calls?

Enter: `ltrace` (or `dtrace` on MacOS).

These tools work like `strace` (many options work the same), but can require
more setup (e.g., describing how fancy data structures should be printed). 

---

## Valgrind

Valgrind is a suite of tools for _dynamic analysis_ (understanding your process
as it runs). 

The built-in tool most often used is `memcheck`, which is used to identify
errors in memory management. One common reason to use `memcheck` is if you
suspect that your program has a _memory leak_: some of the memory being
allocated is not being freed.

It can also point out where you are making illegal writes and other memory
violations.

---

## Valgrind: leaky code

`demo.c`

```c
#include <stdlib.h>

void tennumbers(void){
  int* x = malloc(10 * sizeof(int));
  x[0]  = 10;
  x[1]  = 9;
  x[2]  = 8;
  x[3]  = 7;
  x[4]  = 6;
  x[5]  = 5;
  x[6]  = 4;
  x[7]  = 3;
  x[8]  = 2;
  x[9]  = 1;
  x[10] = 0;        
}                   

int main(void){
  tennumbers();
  return 0; 
}
```

---

## Valgrind: memchecking

```bash
gcc -o badcode demo.c
valgrind --leak-check=yes ./badcode
```

The crucial output:

```
==708172== Invalid write of size 4
==708172==    at 0x40011DF: tennumbers (in /home/matthew/teaching/software_tools/common_repo/07-debugging/badcode)
==708172==    by 0x40011F0: main (in /home/matthew/teaching/software_tools/common_repo/07-debugging/badcode)
==708172==  Address 0x4ab1068 is 0 bytes after a block of size 40 alloc'd
==708172==    at 0x48748A8: malloc (vg_replace_malloc.c:446)
==708172==    by 0x400114A: tennumbers (in /home/matthew/teaching/software_tools/common_repo/07-debugging/badcode)
==708172==    by 0x40011F0: main (in /home/matthew/teaching/software_tools/common_repo/07-debugging/badcode)
```

```
==708172== HEAP SUMMARY:
==708172==     in use at exit: 40 bytes in 1 blocks
==708172==   total heap usage: 1 allocs, 0 frees, 40 bytes allocated
```

---

## Valgrind: types of memory loss

```
==708172== LEAK SUMMARY:
==708172==    definitely lost: 40 bytes in 1 blocks
==708172==    indirectly lost: 0 bytes in 0 blocks
==708172==      possibly lost: 0 bytes in 0 blocks
==708172==    still reachable: 0 bytes in 0 blocks
==708172==         suppressed: 0 bytes in 0 blocks
```

- "definitely lost" -- you allocated memory and lost the pointer to this memory
- "indirectly lost" -- you allocated memory and lost the pointer to where you stored the pointer
- "possibly lost" -- you probably lost the pointer, but you might be doing something fancy 
- "still reachable" -- you allocated memory, still have the pointer, but never freed the memory
- "suppressed" -- an issue Valgrind _would_ report but you told it not to

---

## Valgrind: other uses

Aside from the `memcheck` module, Valgrind has other utilities:

- `cachegrind`: profile your code (find out which instructions are being executed most often).
- `callgrind`: similar, but creates a _call graph_ of relations between calls.
- `hellgrind` and `drd` (thread error issues: concurrent computing)
- `massif` measure memory usage over time.

In general, Valgrind is most useful for helping you identify inefficiencies and
measure problems that accumulate over time.

---

## The main event: GDB

While `strace` traces calls, and `valgrind` (generally) profiles your program,
`gdb` is the GNU Debugger. 

This is a very general-purpose tool, but aims to support you in four main activities: 
 1. Running your program.  
 2. Making your program stop at specific points.
 3. Inspecting what has happened to values in your code.
 4. Changing values, live, to experiment with fixes. 

`gdb` is a debugger specifically for C/C++ (and Fortran and Modula-2) but forms
a prototype for debuggers in other languages.

While debuggers can work on many compiled programs, to make debugging easier you
can turn on debugging symbols when compiling.

```
gcc -g -O0 -o badcode valgrinddemo.c
```

---

## GDB: Running your program

As with `strace` and `valgrind`, you pass your program as an argument to `gdb`

```bash
gdb ./badcode
```

(As with `strace`, you can also connect to a running process with `gbd -p
[pid]`)

Unlike those tools, `gdb` does not automatically run the program. GDB presents
its own interactive shell, with the program in context. You could run the
program with:

```
(gdb) run
```

Or, if typing 'un' is taking up too much of your valuable time, just:

```
(gdb) r
```

However, only running the program doesn't do much by itself.

---

## GDB: Stopping your program

A key use of debuggers is to define a point (or several points) where you want execution to halt:

```
(gdb) break tennumbers
Breakpoint 1 at 0x1141
```

You can look at what your options are:

```
(gdb) info functions
All defined functions:

File valgrinddemo.c:
18:     int main(void);
3:      void tennumbers(void);
```

Now, when you run, the program will stop each time it reaches the breakpoint (in
this case, once). 

---

## GDB: Inspecting values

```
(gdb) r

Breakpoint 1, tennumbers () at valgrinddemo.c:4
4	  int* x = malloc(10 * sizeof(int));
```

To navigate execution from a breakpoint, there are some commands with important
differences:

- `step` or `s`:  Step program until it reaches a different source line.
- `stepi` or `si`: Step program one instruction exactly.
- `next` or `n`:  Step program, proceeding through subroutine calls.

The difference between `step` and `next` is important when you are trying to
navigate past calls to library functions (like `malloc`).

To look at values:

```
(gdb) print x
$1 = (int *) 0x555555559010
(gdb) print x[0]
$2 = 10
(gdb) print x[9]
$3 = 0
```

(`print` can also be abbreviated to `p`)

---

## GDB: Changing values

Because `print` can evaluate any expression, you can make arbitary changes at
your current point of execution.

```
(gdb) p x[6] = 100
```

(You can also do this with `set var x[4]=30` if you don't need to see it echo).

This sort of modification can help you test out if certain changes would fix
your code, without you having to rewrite and recompile it.

If this works, you can type `edit` and GDB will open your source file with your
editor, positioning your cursor at the line you were just executing.

Other useful commands include
 - `list`: show the context around where you are in your code's execution.
 - `jump`: jump to a specific line of your code (e.g., to skip something).
 - `continue` : continue execution from where you currently are.
 - `apropos [term]`: find commands relating to a term.
 - `help [command]`: learn what something does.
 - `quit`: what we are about to do.

---

## GDB: Beyond the basics

Becoming fluent with a debugger takes time. Like many utilities we introduce in
this unit, GDB has depths -- it can make powerful alterations to programs on the
fly (making it very useful for, e.g., _reverse engineering_).

Part of what makes using a debugger seem complicated is that programs themselves are
often more complicated than high-level abstractions would lead you to believe.

What we hope from this week is that you come away with a basic ability to
navigate and tweak a program via a debugger, and remember `strace` and
`valgrind` uses for the future.

---

## Labs this week: 'Crack Me'

Using the tools introduced, find the passwords that each of these executables
require.

Warning: Some of these are very tricky (not my fault).

---

## The End

We'll see you in the labs on Friday.

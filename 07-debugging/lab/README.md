# Debugging (and Crackmes)

For this lab we're going to solve some crackmes!  Crackmes are little
reverse engineering puzzles where you have to figure out a password
for a program without being able to look directly at code that is
being run.

Each program runs directly on a commandline and will prompt you for a
password.  Your task is to figure out what that password is.  The
programs are written using POSIX C (so should compile and run
absolutely anywhere).

## To begin

To begin download the source code and run `make` to build the
crackmes.

<https://github.com/uob-jh/crackmes>

You'll end up with five little crackme programs to run.

**Note**: You also have the source code for all the crackmes... but
reading it defeats the objective somewhat.  If you *really* can't do
one take a peek, there are ROT13'd hints inside and if you *really,
really* can't do one there are steps towards the passwords in the
solutions.  There is also a testing script called `cheater.sh` that
contains solutions (but with no explanations).
  
## Suggestions

We recommend the following tools (all of which are installed on the
lab machines):

- `gdb`: general purpose debugging tool.  Can step through a program
  and stop where you like to inspect things. [The documentation is
  available
  online.](https://sourceware.org/gdb/current/onlinedocs/gdb)  It
  is intimidating to use at first, but with practice it'll get easier:
  it is *the standard* debugger for a reason and it is crazilly
  powerful.
- `strace`: check what system calls a program makes.
- `ltrace`: check what library calls a program makes.
- `strings`: look for strings of printable characters in an arbitrary
  binary blob.
- `objdump`: extract the compiled instructions from a binary.

## Tutorial
```
$ git clone https://github.com/uob-jh/crackmes
Cloning into 'crackmes'...
remote: Enumerating objects: 10, done.
remote: Counting objects: 100% (10/10), done.
remote: Compressing objects: 100% (8/8), done.
remote: Total 10 (delta 2), reused 10 (delta 2), pack-reused 0
Receiving objects: 100% (10/10), done.
Resolving deltas: 100% (2/2), done.
$ cd crackmes/
$ make
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-1.c   -o crackme-1
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-2.c   -o crackme-2
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-3.c   -o crackme-3
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-4.c   -o crackme-4
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-5.c   -o crackme-5
$ ./crackme-1
What is the password?
password
Nope
```

Hmm... the password isn't `password`... what else could it be?  Lets
try the `strings` tool to see if we can find it…

```
$ strings -d ./crackme-1
/lib64/ld-linux-x86-64.so.2
libc.so.6
puts
stdin
getline
__libc_start_main
free
GLIBC_2.2.5
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
[]A\A]A^A_
What is the password?
Beetlejuice
You win!
Nope
;*3$"
```

Anything in there look suspicious?  What about that `;*3$` on the last
line?  Lets try that.

```
$ ./crackme-1 <<<';*3$'
What is the password?
Nope
```

Still not right.  Can we use `ltrace` to get some more hints?

```
$ ltrace ./crackme-1 <<<';*3$'
puts("What is the password?"What is the password?
)                                                  = 22
getline(0x7ffe283e27b0, 0x7ffe283e27a8, 0x7f74213889c0, 0x7ffe283e27a8)        = 5
strcmp(";*3$", "Beetlejuice")                                                  = -7
puts("Nope"Nope
)                                                                   = 5
free(0x207c6b0)                                                                = <void>
+++ exited (status 1) +++
```

If you're still not sure what the password is you'll have to view the
source code:

```
$ gdb ./crackme-1
Reading symbols from ./crackme-1...done.
(gdb) b main
Breakpoint 1 at 0x4006ae: file crackme-1.c, line 7.
(gdb) run <<<';*3$'
Starting program: /home/jh18636/crackmes/crackme-1 <<<';*3$'

Breakpoint 1, main () at crackme-1.c:7
7	 char *input = NULL;
(gdb) disas
Dump of assembler code for function main:
   0x00000000004006a6 <+0>:	push   %rbp
   0x00000000004006a7 <+1>:	mov    %rsp,%rbp
   0x00000000004006aa <+4>:	sub    $0x30,%rsp
=> 0x00000000004006ae <+8>:	movq   $0x0,-0x20(%rbp)
   0x00000000004006b6 <+16>:	movq   $0x0,-0x28(%rbp)
   0x00000000004006be <+24>:	movq   $0x0,-0x10(%rbp)
   ```
   
Step (`si`) it through and use the print commands to look at what is
happening (`i r` for registers `p` for expressions).
  
## Hints

- `crackme-1`: this is easy... read the output of `ltrace`!
- `crackme-2`: a bit harder! I've taken steps to ensure you can't use
  `strings` or `ltrace` like `crackme-1`... you should be able to work
  it out from the disassembly though…
- `crackme-3`: if you use `ltrace` the password you provide doesn't
  look like its getting tested against the real password? What is
  happening?
- `crackme-4`: if you use `ltrace` you'll see this one is
  random... have I used the random number generator correctly though?
  Why does it have extra weird code for OpenBSD?  How do random
  numbers work there?
- `crackme-5`: this is hard! There are infinitely many valid solutions
  though... What's the shortest one you can find? What happens if you
  type `.` as part of your password?

## If you want to do this on your own machine…

This should work anywhere... if you want to do it on your own computer
have at it! There are plenty of other debugging tools out there and they're all
useful to varying degrees. 

Just bare in mind two things:
- That it's fair for us to ask questions on the ones on the lab machines (the above list) in any exam you may sit `;-)`
- That the TAs don't know how your computer works.  They've all used
  GDB before though…

If you use a Mac or run BSD the standard debugger is `lldb` instead of
`gdb`.  It is *very* similar, but does things differently.  You also
have `dtrace` which can do a lot of what `strace` does (and a bit
more).

If you run Windows... Visual Studio has a nice debugger, but it'll
show you the code unless your careful! [x64dbg looks like a nice
tool.](https://x64dbg.com)


# Debugging

[lecture slides](./slides.md)

This week we are focusing on how you can go about _debugging_ programs, not
through inspection of the high-level source code, but through the use of tools
that interact with the compiled binary. In particular, we are going to introduce
you to the `strace` tool for tracing system calls, the powerful commandline
debugger `gdb`, and the memory-leak-finder `valgrind`.


## Pre-reading

- `man strace`: Please read the 'Description' and 'Notes' sections (you don't
  need to learn about all the options, just the ones covered in the lecture).
- Run `info gdb` and navigate to 'Sample Session', or read this same file online
  [here](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Sample-Session.html#Sample-Session).
The goal is not to understand the m4 program being debugged, but how to use
`gdb`. The rest of the manual can be considered optional reading. 



## Exercises
 - [CrackMe](./lab/README.md)


## Optional reading
 - [The Valgrind Manual](https://valgrind.org/docs/manual/manual.html) will not
   be needed for the lab, but may help you better understand profiling and
memory testing.

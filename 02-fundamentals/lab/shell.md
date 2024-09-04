# Shell expansion

This exercise is about studying shell expansion. You should run it on your Debian VM in Vagrant.

Create a C program `arguments.c` with the following contents. You can use `nano arguments.c` for this, for example.

```C
#include <stdio.h>

int main(int argc, char** argv) {
  for(int i=0; i < argc; i++) {
    printf("Argument #%i: [%s]\n", i, argv[i]);
  }
  return 0;
}
```

Compile this with `gcc -Wall arguments.c -o arguments`. 

## Whitespace

The program prints all its arguments, one per line. The program gets its arguments from the program that started it - in this case the shell.
Try running the program with the following commands:

    ./arguments
    ./arguments hello
    ./arguments one two three

Now that you are familiar with what the program does, try the following:

    ./arguments one       two
    ./arguments "one two"
    ./arguments "one      two"

How, based on these examples, does the shell handle whitespace in the line you type?

## Pattern matching

Try the following:

  * `./arguments *` in the folder that contains the arguments program, and its source code arguments.c.
  * Make an empty subfolder with `mkdir empty`, switch to it with `cd empty` and then run `../arguments *`. Since you are now in the subfolder, we need two dots at the start to say "run the program arguments from the folder _above_". What happens?
  * Go back to the folder with the program by running `cd ..` and then do `ls` to check you're back in the right folder. In this folder, find three different ways to get the program to produce the following output:

```
Argument #0: [./arguments]
Argument #1: [*] 
```

## Files with spaces in their names

The command `touch FILENAME` creates a file. Create a file with a space in its name by typing `touch "silly named file"`. What would happen if you left the quotes off (you can try it, then do `ls`)?

Start typing `ls sill` and then press TAB to autocomplete. Assuming you have no other files whose name starts with _sill_, what happens? Use this method to get the arguments program to print the following:

```
Argument #0: [./arguments]
Argument #1: [Hello world!] 
```

The command `rm` (remove) deletes files again. Use it to remove your file with spaces in its name, using one of several methods to get the shell to pass the spaces through to `rm`.

## Shell variables

In the shell, `VARIABLE=VALUE` sets a variable to a value and `$VARIABLE` retrieves its value. For example, to save typing a filename twice:

    p=arguments
    gcc -Wall $p.c -o $p

which expands to `gcc -Wall arguments.c -o arguments`. If you want to use a variable inside a word, you can use curly braces: `${a}b` means the value of the variable `a` followed by the letter b, whereas `$ab` would mean the value of the variable `ab`.

It is good practice to double-quote variables used like this, because if you tried for example to compile a program called `silly name.c` with a space in its name, then

    program="silly name"
    gcc -Wall $program.c -o $program

would expand to

    gcc -Wall silly name.c -o silly name

and this would confuse your compiler because you are telling it to compile three source files called `silly`, `name.c` and `name` to a program called `silly`. Correct would be:

    program="silly name"
    gcc -Wall "$program.c" -o "$program"

which expands to

    gcc -Wall "silly name.c" -o "silly name"

which does what you want - if you indeed want a program with a space in its name!

There is no harm in double-quoting a shell variable every time you want to use it, and this is good practice as it still works if the variable is set to a value that contains spaces.

Note that we also had to quote setting the variable name in the first place, because

    program=silly name

would translate as: set the variable `program` to the value `silly`, then execute the program `name`. Variable assignments only apply to the first argument following them, although you can assign more than one variable.

Note that this does not work as expected either:

    file=arguments gcc -Wall "$file.c" -o "$file"

The problem here is that the shell first reads the line and substitutes in the value of `$file` (unset variables expand to the empty string by default) before starting to execute the command, so you are reading the variable's value before writing it. Leaving off the quotes doesn't help: you need to set the variable on a separate line.

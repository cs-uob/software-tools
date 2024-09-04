# Pipes

The command `ls | head` runs `ls` and `head` and pipes the standard output of ls
into the standard input of head. This 'piping' of output to input is the basis
of composability between Unix tools, and allows you to combine single tools into
a toolchain that produces a specific outcome. 

The following shell commands are particularly useful in pipes:

  - `cat [FILENAME [FILENAME...]]` writes the contents of one or more files to standard output. This is a good way of starting a pipe. If you leave off all the filenames, cat just reads its standard input and writes it to standard output.
  - `head [-n N]` reads its standard input and writes only the first N lines (default is 10 if you leave the option off) to standard output. You can also put a minus before the argument e.g. `head -n -2` to _skip the last 2 lines_ and write all the rest.
  - `tail [-n N]` is like head except that it writes the last N lines (with a minus, it skips the first N ones).
  - `sort` reads all its standard input into a memory buffer, then sorts the lines and writes them all to standard output.
  - `uniq` reads standard input and writes to standard output, but skips repeated lines that immediately follow each other, for example if there are three lines A, A, B then it would only write A, B but if it gets A, B, A it would write all three. A common way to remove duplicate lines is `... | sort | uniq | ...`.
  - `wc [-l]` stands for word count, but with `-l` it counts lines instead. Putting a `wc -l` on the very end of a pipe is useful if you just want to know how many results a particular command or pipe produces, assuming the results come one per line.

All these commands actually take an optional extra filename as argument, in which case they read from this file as input. For example, to display the first 10 lines of a file called `Readme.txt`, you could do either `cat Readme.txt | head` or `head Readme.txt`.

## Word list exercises - pipes

Most Linux distributions (including Debian) come with a dictionary file `/usr/share/dict/words` that contains a list of English words in alphabetical order, for use in spell-checking programs. The list includes a selection of proper nouns, for example countries and cities. 

(If you want to look at this list on a system that doesn't have it already, you
can download a version with `wget https://users.cs.duke.edu/~ola/ap/linuxwords
-O words` -- but the file might be slightly different from the Debian installed
version)

Find one-line commands, possibly with pipes, to print the following to your
terminal. You can either start each command with `cat /usr/share/dict/words |
...` or do it without cat by providing the words file as an argument to the
first command in your pipeline.

  * The first word in the file. 
  * The last word in the file. 
  * The number of words in the words file - there is one word per line.
  * The 6171st word in the file. 
  * The first five words that are among the last 100 words on the list.
  * The last ten words in the file, sorted in reverse order. 
  
## Redirection

Find a directory on your VM that contains some files, and is writeable by your
current user (e.g., your `/shared` directory, or your `vagrant` user's home
directory). `cd` to that directory.

 * `ls -l` prints a detailed listing of the directory to standard output.
   Redirect this listing to instead store it in a file called `tmp` _(if you
don't know how, revist the second video+slides on piping)_.
 * If you inspect the file content (e.g., by `cat tmp`) and compare it to what
   you see when re-typing `ls -l` now, you should be able to find a difference.
However, it's a small difference and might be hard to spot. Let's use a tool
designed to help spot small differences between files. The `diff` utility takes
in (at least) two filenames and produces output that compares the two files
(feel free to test this elsewhere).  We have one file, `tmp`, but the thing we
want diff to compare against is _the result of executing ls -l again right now_,
not a file. Can you figure out how to redirect `ls -l` output to `diff` so it
compares it with `tmp`? 
 * The `diff` output is also appearing on standard output. Redirect it to a file
   `difflog` like you did for `ls -l` before. By creating this file, we're
changing what `ls` will report about this directory. Let's keep track of that
change by running the same `diff` command again, but this time _appending_ the
new output to `difflog`.  Inspect the resulting file and see what it tells you
about the changes.



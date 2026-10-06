# Regular expressions exercises

## Grepping the dictionary 

Let's revisit the dictionary file `/usr/share/dict/words` from last week's piping exercises. `grep [-iv] EXPRESSION` reads standard input and prints only lines that match the regular expression to standard output. With `-i` it is case-insensitive, and with `-v` it only prints lines that do _not_ match the expression. Given this information, can you find the following?
  
  * All words containing the letter Q, capitalised. _(A regular expression containing a string of one or more letters matches all strings that contain the expression as a substring.)_
  * All words starting with the letter R, in either upper or lower-case. _(The regular expression `X` would match an X anywhere in the word, but `^X` matches an X only at the start of the string)_. 
  * All words ending in j. _(The character `'$'` matches the end of the string in much the same way as `^` matches the start, but you may have to single-quote it to stop the shell from interpreting the dollar sign)_. 
  * The number of words containing the letter Q, ignoring case (e.g. capitalised or not).
  * The first five words containing the letter sequence 'cl' _(remember, you can combine `grep` output with other tools using pipes)_.
  * All words containing the sequence "kp", but not "ckp". _(Hint: to specify that something _isn't_ a character, you may want to look at the documentation on 'bracket expressions'.)_
  * The last 15 words of exactly two letters. The expression `.` (period) matches a single character, but can you figure out how to specify that a string shouldn't have more characters? _(Hint: the characters you need are all mentioned above)_. 
  * All three-letter words with no vowels (aeiou). _(Hint: this is in part a job for bracket expressions again.)_
  * All words of exactly 7 letters, where the third one is an e and the word
    ends "-ded". _(This kind of search is really useful for crosswords)._ 
  * Find all words that start with a P (whether capitalised or not), and contain
    at least four instances of the letter a. Putting a `*` after something in a
regular expression searches for _any number of repetitions of this, including 0_
so for example `'a*'` would find words with any number of the letter a,
including 0 (which is not what you want here).  

## Sediting exercises

`sed -e COMMAND` reads lines from standard input, transforms them according to
the command and writes the results to standard output. `sed` has its own rich
command language but the most common usage is `s/SOURCE/DEST/` which changes
substrings matching the source regular expression into the destination one.

 * Use `grep` to find all dictionary words ending in 'ay', and then pipe this to
   a `sed 's/SOURCE/DEST/'` command to change 'day' into 'week'. Look at the
output and how lines are affected.
 * The `SOURCE` part of the command works very similarly to the patterns you
   used in grep.  In the same selection as above, replace all words that begin
with 's' with the word 'sway'. 
 * The `DEST` pattern can refer to the matching content from `SOURCE` using the
   character `&`. Introduce some redundancy into the word list and make your
output duplicate the match after a space, for any line containing 'day', (e.g.,
so "saturday" becomes "saturday day").
 * You can also define subexpressions in the matching part with escaped
   parentheses (`\(` and `\)`) and refer to those in the replacement part. `sed
's/^t\(.*\)/\1s/` would take the 't' off the front of any line that began with
it and put an 's' on the end. Using this, can you figure out the sed expression
to alter these lines so that any line ending in 'day' becomes a string "Xday or
Xweek", where `X` is the other part of the word?
 * Finally, try using two subexpressions at once to solve this: I want to see
   any word ending in _either_ 'way' or 'day' to be flipped around and
parenthesised, so that 'someday' becomes 'day (some)' and 'speedway' becomes
'way (speed)'. 
 * We've been doing a lot of work on single-word lines, which are great for
   examples, but not necessarily realistic for how you'll deploy `sed` in
reality. Study the difference between applying `s/a/e/` and `s/a/e/g` to your
list of words. What is the `g` instruction doing, and why might that be
important?

## More grep

Here are some more advanced questions that will require you to
understand more about `grep`, its options, and how regular expression syntax
works.  For this exercise you'll want to refer often to a manual for `grep`.  
You can access one on the commandline by invoking `man grep`.


1. Study the documentation for the `-w` option. Contrive a file such that `grep
   PATTERN FILE` returns two different lines but `grep -w PATTERN FILE` returns
only one line.
2. There is a `-o` option for `grep` that makes it print out all the matches it
   finds in a file. You'll have seen beforehand that you can count the results
of a search with `wc -l`. However, `grep` also has a `-c` option which counts
matches. Can you find the situation where `grep -o PATTERN FILE | wc -l` and the
`grep -c PATTERN FILE` produce different results? Can you explain why? 
3. Some words have different spelling between British English and American
   English. For example, 'encyclopaedia' is valid in British English but not
American. Can you write a regular expression that would match both of these
words, but nothing else? How about matching both 'color' (American) and 'colour'
(British)?
4. UK postcodes follow a general schema of two letters followed by one number,
   followed by an optional space, then another number, followed by two more letters. Can you write
a regular expression that would match such sequences?
5. In practice, the above is a simplified version of the system, and a better UK
   postcode validator regex is known to be
`^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA)
?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2}
?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$`. Try breaking apart this monster to
understand what is being tested, and find an example that would match this expression
but fail to match the schema described for the fourth question. 

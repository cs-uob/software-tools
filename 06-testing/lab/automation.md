# Automated Testing

Whether or not you are following a test-driven development approach in your
project, there should still be tests for your codebase (non-TDD workflows would
place writing tests later in the development cycle, which can be a bad idea, but
is still better than not writing them at all).  Regularly running tests as you
develop allows you to notice when changes you make to your code have affected
some functionality.

However, [good programmers are lazy](https://threevirtues.dev/), and remembering
to _manually_ run tests requires an unnecessary amount of effort. This exercise
covers two easy methods to integrate _automated_ testing into your development
process. 


## Testing as a pre-commit hook

The first approach is one you can deploy in any Git repository. If you have not
already done this, create a Git repository to hold your calculator code from the
previous exercise (remember: create the repository with `git init .` inside the
directory, then `git add` the files). Make sure the files are committed and the
repository is clean.

Then, inside your repository, create and open the file `.git/hooks/pre-commit`,
and add the following:

```bash
#!/bin/sh

gcc -I /usr/local/include/unity -o tests test.c -l unity 
./tests 
```

Save the file, then run

```bash
chmod +x .git/hooks/pre-commit
```

Now make a change to your calculator library code that would cause one of your
tests to fail -- it doesn't matter which. Change a '+' to a '-' somewhere. Then
try to commit your changes to the repo with

```bash
git commit -a
```

You should find that instead of opening your text editor to write the commit
message, Git shows you the results of your test script, which ends with 'FAIL'.
Whoops! You tried to commit code that fails your unit tests -- better fix the
issue. Go back to `calc.c` and undo whatever breaking change you introduced
above. Save and try to commit once again -- this time, Git should allow you to
write your commit message, and will create the commit.

What has happened here is that we created a 'pre-commit hook' -- a script that Git
will run _before_ it creates a commit. If this script returns cleanly (a return
value of 0), then everything will continue and you can commit as normal. If it
doesn't (a nonzero return value), then Git will abort the commit. 

Our particular script is very simple: it's just a shellscript building and
running the test code we used earlier.  This has the effect here of making it
impossible (well, not really) to commit code to the repo that is broken (because
our `tests` executable returns a non-zero value if any test fails).  You can use
almost any executable script (in any scripting language) as a 'hook', and you
can have these scripts carry out a bunch of functions automatically when you do
certain things within your repository. In your future work, even when working in
a different language, you could write a shellscript that runs your tests, and
use this as a pre-commit hook to prevent you committing broken code to your
repository.

The most immediately useful hook for you is `pre-commit`, but there are others.
You can see some example scripts already populated in `.git/hooks/`, including a
`pre-commit.sample` that checks for whitespace issues -- see [this
guide](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) for more
information on the different hooks. 

For the moment, you've automated running your tests every time you try and
commit to the repository (which should be often, as you develop).  This doesn't
solve the issue of _writing_ tests, but it should still allow you to catch
yourself introducing bugs that might otherwise have escaped your notice.  If for
some reason you need to make a commit _despite_ your code being broken, you can
skip the check with `git commit --no-verify`. If you want to disable the check
entirely (why?), you can just delete the script.


## Testing as a GitHub Action



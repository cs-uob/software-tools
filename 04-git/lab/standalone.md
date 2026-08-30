# [Git](#git)

Git is the de facto standard version control system used throughout CS.
It also lives up to its name as being a *pain* to use. Take it slow and
take this lab as a chance to practice using the Git commandline.

This lab *should* work fine on pretty much any computer (well… maybe not
Windows) but we'd still recommend completing it in the unit's chosen virtual
machine (mostly because we can test the lab in a virtual machine…).


## [Git documentation](#git-documentation)

Git comes with *extensive* documentation. Run:

``` example
apropos git
```

To see all of it, or run:

``` example
apropos git -a tutorial
```

To find documentation relating to git and (the `-a`) tutorials. Read any
of the documentation you think might be useful with the `man` command.

**Task:** There is a man page that documents the *everyday git* commands
you might want to use. Find it with `apropos` and read it with the `man`
command.

You should already recognise one of the `gittutorial` pages…

## [Configuring your identity](#configuring-your-identity)

Git is all about tracking changes to source code. That means it needs to
know *who* made *what* changes.

Run the following two lines to set up git correctly. You only need to do
this once when you install git, not every time you create a new
repository.

``` example
git config --global user.name "YOURNAME"
git config --global user.email "YOUREMAIL"
```

The name and email address aren't actually sent anywhere or checked…
they're just listed with alongside the changes you make to the code so
later programmers know who to blame (see `man git-blame`). You can 
put anything you like here (Git will happily accept `-` as your email address,
and it does not send you email).

This alters the *global* git configuration (the settings applied to
*every* git repository you work on), but you can also make these changes
on a repository by repository basis. Just drop the `--global` and run
the command inside the git repository you want to apply the changes to.
This is useful if you're *Bruce Wayne* and need to keep your public and
private development projects separate (or if you do subcontracted
development work).

## [For those of you using Vagrant](#for-those-of-you-using-vagrant)

If you are running a VM on a lab machine, then you would need to
reconfigure Git every time Vagrant rebuilds the VM, for example when you
log in to a different lab machine. You can put these commands in your
Vagrantfile, like anything else that you want to run when Vagrant (re)builds
your box, but they need to be run as the `vagrant` user and not the root user.
So add the following block to your `Vagrantfile` just before the `end` line,
editing in your name and email address.  Normally Vagrant will run these
provision blocks as the system administrator `root`, but you can run it as the
normal `vagrant` user by adding the `privileged: false` keyword.

``` ruby
config.vm.provision :shell, privileged: false, inline: <<-SHELL
    git config --global user.name "YOURNAME"
    git config --global user.email "YOUREMAIL"
SHELL
```

If you start getting errors about the git command not being installed:
install it! If you're using the Debian-based VM the command you need is
`apt` (see `man apt` if you're not familiar with it). We covered installing
packages in the first lab.

Some people find having two provisioning blocks a bit messy. You could
reduce them to just one block, but you'll need to use the `su` command
to ensure that you configure git as the `vagrant` user.

## [A sample project and repository](#a-sample-project-and-repository)

Let's say you want to start developing a C program. Let's make a folder:

``` example
mkdir project1
cd project1
git init
```

The last command created an empty git repository in a subfolder called
`.git`. We can check with `git status` to see whether there are any
changes, and git reports `nothing to commit`.

Create a file `main.c`, with your preferred text editor and add some sample
content like this (you should be able to copy-paste into your terminal):

``` c
// file: main.c
#include <stdio.h>

int main() {
    puts("Hi");
    return 0;
}
```

Run `git status` and you will see `main.c` in red under *untracked files* - this
is a new file that git does not know about yet. Run `git add main.c` followed by
another `git status` and the file is now green under *files to be committed*.

Commit the file with `git commit -m "first file"` or something like that—you
need double quotes if you want spaces in your commit message.  After the commit
goes through, type `git status` again and you should see *nothing to commit,
working tree clean*, which means your current folder contents match the versions
git has most recently recorded.  Try `git log` and you will see that there is
now one commit in the log.

Every git commit must have a commit message. You can either add one with
the `-m` flag, or leave that off and git will drop you into the system default
editor to write one. That editor is normally `vim` by default (the command to
quit is press the escape key then `ZZ`). You can change the default text editor
by setting *environment variables* with command `export EDITOR=nano`.

If you want to keep this setting when you relaunch your shell the next time you
log in, then the export line has to go in a file called `.profile` in your home
directory, which is a file that the bash shell processes when it starts up.

To keep a profile file around when Vagrant rebuilds your VM you could add a
provisioning line in your Vagrantfile to ensure the `.profile` is recreated with
your chosen editor:

``` example
echo 'export EDITOR=ed' >>~vagrant/.profile
```

## [Ignoring files](#ignoring-files)

Compile your code with `gcc main.c -o program`, and check with
`./program` that it runs and prints *Hi*. (If you get an error that
`stdio.h` doesn't exist, then you have installed gcc but not the C development
libraries. Hint: `man apt-file`.)

If you look at `git status` now, the program file shows as untracked,
but we do not want to commit it: the repository works best when you
store only your source code, and anyone who needs to can check out a
copy and build from there. Among other things this means that people on
different platforms e.g. Linux and Mac, Intel and ARM and so on can each
compile the version that works for them.

So we want to tell git to ignore the file `program` and any changes in it, which
we do by creating a file called `.gitignore` and adding an expression on each
line to say which file(s) or folders to ignore—you can use `*.o` to select all
object code files, for example.

- Create a file `.gitignore` and add the single line `program` to it.
- Do another `git status` and notice that while the program is now
  ignored, the ignore file is marked as new. This file does belong in
  the repository, so add it and commit it.
- Check that `git status` reports *clean* again, and that `git log`
  contains two commits.

## [Commit and checkout](#commit-and-checkout)

As you develop, you should regularly code, commit, repeat. To practice
this, change *Hi* to *Hello* in the program, rebuild and run the
program, then add and commit the source file again—check with
`git status` at the end that you get *clean* again.

The command `git add .` adds all new and changed files and directories in the
current directory in one go. This can be useful, but note that it would add any
previously-untracked files that have appeared in the working directory. If you
only want to commit all changes to *tracked* files that you have already added,
running `git commit -a` may be better.

Practice development on your `main.c` file. Make small changes to what the
program does, and commit each of them. Use `git log` to see how the chain of
commits is built over time (when you have more than one screen of commits, `git
log |less` lets you scroll).


## [Diff, restore, checkout, revert, reset](#undo-buttons)

The benefit of a version history becomes most apparent when you want to compare
your current version to an old one, restore a file to an old version, or go look
at what the entire project used to be like.

- Make sure your changes are commited and your `git status` is 'clean'. 
- Use `git log` to show the history of your commits. 
- Note the first 6 or so characters of the commit hash of the commit
  where you added the ignore file, but before changing *Hi* to *Hello*.
  You need at least 6 characters, but only as many so that it's not ambiguous to
Git which commit you mean. You'll want to copy these characters to use in the
below.

### Diff

Run `git diff HASH`, replacing HASH with the characters mentioned above.  Git
will show you a visualisation of how your current repository differs from the
version that existed at the commit you identified (it may place you inside a
`less` environment to scroll through this output, which you can exit by pressing
'q'). Read the diff and understand how to interpret it, asking for help if
needed.

### Restore

 Run `git restore -s HASH main.c`, using the same hash as before. If you run
`git status` now, you will see `main.c` has been modified. If you run `git diff`
(without HASH), you can see how your current `main.c` differs from the most
recent commit -- this should be the exact opposite of the diff from the previous
comparison. You have restored your working copy of `main.c` to the version at
the commit you specified. 

These changes have not been committed to the repository, so they are not
permanent.  Run `git restore main.c`, and then run `git status`. Your `main.c`
should now have returned to the most recent version.

### Checkout

Run `git checkout HASH`. Git will print a warning about the HEAD pointer.  Check
the source file, and notice that it is now reverted to the old version, like
when you used `restore`. However, when you run `git status`, you will see
something quite different -- Git will tell you that you are in a detached head,
and that the working tree is clean. 

There is an important conceptual difference here -- when you `restore`, you
simply transform your working copy of a file to a version from your history. Git
notices these changes as uncommitted modifications to a tracked file.  When you
`checkout` a commit, you also change Git's concept of 'when' you are in the
repository history, so it sees the files as being unmodified relative to what
they should be from the latest commit.   

Use `git checkout main` to return to the latest version of your files, and Git
will set up the HEAD pointer again ready to accept new commits.

### Revert and Reset

If you actually want to undo commits, then you have two options:

- `git revert HASH` adds a new commit that returns the files to the
  state they were before the commit with the given hash. This is safe to
  use during team development, as it's just adding a new commit. If you
  have commits A, B and do `git revert B` then you get a new commit C so
  anyone else using the repository sees a sequence of commits A, B, C;
  but the state of the files in C is the same as in A.
- `git reset HASH` undoes commits by moving the HEAD pointer back to the
  commit with the given hash, but leaves the working copy alone (you can
  use the `--hard` option to change the files as well). This will break
  things if you have shared your newer commits with other developers, but it's
safe to use to undo changes that you haven't pushed yet (we'll cover push-pull
workflows later).  The effect is as if the commits which you've reset had never
happened.

Note: if you want to revert a commit because you accidentally committed a
file with secret information, and you've already pushed the commit, then
you also have to look up online how to "force push" your changes to
erase all traces of the file on GitHub (or other online providers). If
the secret file contained any passwords, even if you reverted the commit
immediately, then you should consider the passwords compromised and
change them at once.


## [Branch and merge](#branch-and-merge)

We are now going to practice 'branching' and then 'merging'. In many development
workflows, this is how you would work on introducing new features for a project,
without breaking working code.

- Type `git branch` and you will see all the branches that currently exist in
  this repository. You should see only one, called either `master` or `main`.
This is your default branch -- you'll need to know what it's called for
switching back and forth.  
- Type `git branch docs`. This creates a new branch called `docs`, as you can
  see if you run `git branch` again. You should also be able to see how Git
indicates which branch you are currently on, in case you get confused.  
- Type `git switch docs` to switch to the `docs` branch. Currently nothing will
  look different -- `docs` and your default branch are exactly the same.
However, you can check that you switched by looking at `git branch`.
- Create a new file, `README.md` -- this will be your documentation for this
  project ('.md' indicates this is a Markdown file, which is a simple markup
language often used in documentation. If you don't want to pick up Markdown just
now, just call it README.txt and write plaintext documentation instead). Inside
the file, just give your project a name for now by putting a title at the top of
the file.  `git add` your README, and `git commit` your changes. 
- You should see that `git status` reports that you are on the 'docs' branch,
  and the working tree is clean.
- Add another commit in which you describe your project a little more in the
  README.
- Add another commit in which you add a comment to the top of your `main.c`
  file.
- With your 'docs' branch in a clean state, `git switch` back to your default
  branch. You should see that the README disappears (it doesn't exist on this
branch), as does the comment in `main.c` (for the same reason).
- Edit your `main.c` file to change the output string to your own name. Commit
  your changes here, and look at the `git log`.
- `git switch docs` again, and look at the `git log` -- you should see that the
  history is different on the two branches. If you inspect `main.c` you should
see that the change you made on the default branch doesn't exist here. You have
two *parallel lines of development* taking place, which Git allows you to switch
between. Changes on one branch don't affect another. This is ideal if you want
to 'try something out' -- develop a new feature, try a new way to solve a
problem -- without risking breaking your most up-to-date code. You can create as
many branches as you like.
- Being able to split is useful, but more useful is being able to automatically
  **merge** your branches back together, to get all the functionality from
multiple lines of development.  `git switch` to your default branch, and then
run `git merge docs` -- this is going to try and merge your changes on the
`docs` branch into your default branch. 
- If you did things exactly as instructed, the merge command should simply open
  your text editor to ask for a commit message, pre-populated with something
like 'Merge branch 'docs''. Once you save the message, you should see that your
default branch now contains the README file from your 'docs' branch, and the
`main.c` file has *both* the edits made in different branches. Your default
branch and 'docs' are now up-to-date with each other.
- Git is only able to automatically merge changes if they don't **conflict**
  with each other. If you changed a line of a file one way in one branch and a
different way in a different branch, it doesn't know what to do to resolve those
changes.  If this happens, Git will warn about a *merge conflict* and abort the
merge process until you fix the conflicting lines. We cover handling these
conflicts next week.
- While we have merged changes from the 'docs' branch, the branch still exists
  (see it on `git branch`).  We could switch back to it and make new changes,
and then the branch would once again be considered *diverged* and would need
merging again. 
- Alternatively, if we aren't going to want to use a branch any more after
  merging it, we can delete it with `git branch -d docs`. We can always create a
new branch if we need one.  

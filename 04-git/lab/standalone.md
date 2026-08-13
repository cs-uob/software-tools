# [Git](#git)

Git is the defacto standard version control system used throughout CS.
It also lives up to its name as being a *pain* to use. Take it slow and
take it as a chance to practice using the Git commandline.

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
this once when you install git, but not every time you create a new
repository.

``` example
git config --global user.name "YOURNAME"
git config --global user.email "YOUREMAIL"
```

The name and email address aren't actually sent anywhere or checked…
they're just listed with alongside the changes you make to the code so
if somethings wrong later programmers know who to blame (see
`man git-blame`). You can put anything you like here (git will happily
accept `-` as your email address, and it does not send you email).

This alters the *global* git configuration (the settings applied to
*every* git repository you work on), but you can also make these changes
on a repository by repository basis. Just drop the `--global` and run
the command inside the git repository you want to apply the changes to.
This is useful if you're *Bruce Wayne* and need to keep your public and
private development projects separate (or if you do subcontracted
development work).

## [For those of you using Vagrant](#for-those-of-you-using-vagrant)

If you are running a VM on a lab machine, then you would need to
reconfigure git every time vagrant rebuilds the VM, for example when you
log in to a different lab machine. You can put these commands in your
Vagrantfile, like anything else that you want to run when vagrant
(re)builds your box, but they need to be run as the vagrant user and not
the root user. So add the following block to your `Vagrantfile` just
before the `end` line, editing in your name and email address.
Normally Vagrant will run these provision blocks as the system
administrator `root`, but you can run it as the normal `vagrant` user by
adding the `privileged: false` keyword.

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
`stdio.h` doesn't exist, then you have installed gcc but not the C
development libraries Hint: `man apt-file`.)

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

The command `git add .` adds all new and changed files and folders in
the current folder in one go, and is typically the quickest way to add
things when you want to commit all your changes since the last commit.

Sometimes you want to go back and look at another commit, or undo a
commit that broke something—this is when you want a checkout.

- Use `git log` to show the history of your commits. (When you have more
  than one screen, `git log |less` lets you scroll.)
- Note the first 6 or so characters of the commit hash of the commit
  where you added the ignore file, but before changing *Hi* to *Hello*.
  You need at least 6 characters, but only as many so that it's not
  ambiguous to git which commit you mean.
- Run `git checkout HASH` where HASH is the 6 or however many you need
  characters of the commit in question. Git will print a warning about
  the HEAD pointer.
- Check the source file, and notice that it is now back on *Hi*.
- Use `git checkout main` to return to the latest version of your files,
  and git will set up the HEAD pointer again ready to accept new
  commits.

If you actually want to undo a commit, then you have two options:

- `git revert HASH` adds a new commit that returns the files to the
  state they were before the commit with the given hash. This is safe to
  use during team development, as it's just adding a new commit. If you
  have commits A, B and do `git revert B` then you get a new commit C so
  anyone else using the repository sees a sequence of commits A, B, C;
  but the state of the files in C is the same as in A.
- `git reset HASH` undoes commits by moving the HEAD pointer back to the
  commit with the given hash, but leaves the working copy alone (you can
  use the `--hard` option to change the files as well). This will break
  things if you have shared your newer commits with other developers,
  but it's safe to use to undo changes that you haven't pushed yet
  (we'll learn about this next time). The effect is as if the commits
  which you've reset had never happened.

Note: if you want to revert a commit because you accidentally commited a
file with secret information, and you've already pushed the commit, then
you also have to look up online how to "force push" your changes to
erase all traces of the file on github (or other online providers). If
the secret file contained any passwords, even if you reverted the commit
immediately, then you should consider the passwords compromised and
change them at once.



## An advanced puzzle 

The following material relies on researching some deeper, trickier aspects of
how Git works. This material isn't examinable, but it is useful for those of you
trying to deepen your understanding.  We are going to delete a commit, and then
try and *undelete* it.  Git makes it fairly hard to truly delete things
(provided they've ever been staged or commited), but if it *is* going to happen
it'll likely be when you `git rebase` something.  To rescue yourself from such a
situation you'll need to read the documentation and experiment with commands we
haven't told you about.  Your task is to read the docs and figure it out!

### Setup

1.  Create a new branch in a repo you're working on.
2.  Add a bunch of commits… more than 3.
3.  Add another commit. Make the commit message and the content
    memorable. *"Here be treasure!"* or something. This is going to be
    the commit you want to recover.
4.  Add a bunch more commits… again more than 3 so it a bit of a
    challenge.
5.  Do a git rebase (`git rebase -i HEAD^7` or `git rebase [ID of the commit
    where you branched]`) and delete the commit you made with 'treasure' in the
commit message.  Squash some other stuff. Make a real mess of this branch.

### Tasks

If you look at your `git log`, your *treasure* commit is going to have vanished.
Your task is going to be to recover it. If you can find the commit id of your
missing commit you should be able to `checkout` the work and get it back.

1. Find the *commit ID* of the vanished commit. This is where you'll benefit
   from having made the commit message memorable!  Use `git reflog` to see a log
of past actions.  Do you know a shell command that you could use to search it?

2. Restore the commit! What commands do you know to compare the `diff`-erences
   between two commits? Could you make a patch to restore the commit? Do you
know what the `cherry-pick` command does?

3. Let's pretend you can't remember anything about the commit message. From the
root of your Git repo you can find all the objects in it inside `.git/objects`.
They'll be nested inside folders but you can see the contents with `git cat-file
-p ID`.  Starting with the id of a commit you know, get a feel for how these
objects are structured and what different kinds might exist, then write a script
to search the directories for your missing commit.

4. What does the `git gc` command do, and why is it going to make this type of
   investigation a lot harder? When does `git gc` get run?

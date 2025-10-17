# [Git](#git)

Git is the defacto standard version control system used throughout CS.
It also lives up to its name as being a *pain* to use. Take it slow and
take it as a chance to practice using the Git commandline.

This lab *should* work fine on pretty much any computer (well… maybe not
Windows) but we'd still recommend completing it in a virtual machine
(mostly because we can test the lab in a virtual machine…).

If you'd like a `Vagrantfile` to base your work on you can use the
following:

``` ruby
Vagrant.configure("2") do |config|
  config.vm.box = "generic/debian12"
  config.vm.synced_folder ".", "/vagrant"

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update -y
    apt-get install -y git git-man apt-file
    apt-file update
  SHELL
end
```

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

You might also want to read the `gittutorial` pages…

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
before the `end` line, editing your name and email address obviously.
Normally vagrant will run these provision blocks as the system
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
`apt` (see `man apt` if you're not familiar with it).

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

Create a file `main.c`, with your text editor and add some sample
content like this (you should be able to copy-paste into your terminal):

``` c
// file: main.c
#include <stdio.h>

int main() {
    puts("Hi");
    return 0;
}
```

Which text editor should you use? It doesn't honestly matter, but it
needs to be able to write plain text documents (those without
formatting—so not Microsoft Word).

The *standard* editor is called `ed`: but don't use it! It is designed
for back before computers had screens.

The *traditional* programmer editors are `vim` or `emacs`. You *should*
learn one of them (Jo and Matt would both recommend `vim`) but they're
rather confusing if you've never used a programmers' editor before.
Absolutely worth it though; just expect to be rather slow at typing
things for a week or two.

Easier editors include `nano` which works on the command line, `gedit`
which is a bit more graphical or Microsoft's `Visual Studio` which can
edit code on remote systems. They're all configurable and you can make
all of them do things like syntax highlighting and code completion.

We don't care what editor you use: but make sure you make it work for
you by configuring it. You're going to be spending an awful lot of your
degree writing code: a bit of investment in text editor now will pay
dividends later on!

(and I think everyone judges people who are *still* using `nano` in
their final year…)

Do a `git status` and you will see `main.c` in red under /untracked
files/—this is a new file that git does not know about yet. Do
`git add main.c` followed by another `git status` and the file is now
green under *files to be committed*.

Commit the file with `git commit -m "first file"` or something like
that—you need double quotes if you want spaces in your commit message.
Try `git status` again and you should see *nothing to commit, working
tree clean* which means git is up to date with your files. Try `git log`
and you will see that there is now one commit in the log.

Every git commit must have a commit message. You can either add one with
the `-m` flag, or leave that off and git will drop you into the system
default editor to write one. That is normally vim (the command to quit
is press the escape key then `ZZ`). You can change the default editor by
setting *environment variables* with command `export EDITOR=nano`.

If you want to keep this setting when you relaunch your shell next time
you log in, then the export line has to go in a file called `.profile`
in your home directory, which is a file that the bash shell processes
when it starts up.

To keep a profile file around when vagrant rebuilds your VM you could
stick a provisioning line in to your vagrantfile to ensure the
`.profile` is updated:

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
different platforms e.g. linux and mac, intel and ARM and so on can each
compile the version that works for them.

So we want to tell git to ignore the program and changes in it, which we
do by creating a file called `.gitignore` and adding an expression on
each line to say which file(s) or folders to ignore—you can use `*.o` to
select all object code files, for example.

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

# Git forges

Lets set up and use a git forge account with a remote provider. The
*typical* ones you usually see for hosting git repositories are:

- [github.com](https://github.com)
- [gitlab.com](https://gitlab.com)
- [bitbucket.org](https://bitbucket.org)

But *many* more exist. You can even create your own with little more
than an SSH server. Jo's favourite is one called
[sourcehut](https://sr.ht) but you have to pay for it.

If you do want to build your own git server from scratch it isn't that
hard but you have to muck about with *bare* git repos (that we don't
cover) and set some funky file permissions. [Instructions can be found
here for the
brave.](https://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server)

This exercise is based on GitHub, as it is the most popular provider,
but you can use one of the other two if you want as well—although the
web user interface and some advanced features are different, interacting
with all three on the command line is identical and all three offer
unlimited private and public repositories (within reason).

## [Set things up](#set-things-up)

Go to [github.com](https://github.com) and register with a username, an
e-mail address and a password. You might have to click a confirmation
link in an e-mail sent to you.

We are going to use git over SSH, so you need to let git know your
public key (remember, you never give anyone your private key!). Click
the icon in the top right corner of the screen that represents your
avatar (you can of course set a custom one if you like) and choose
*Settings* in the menu, then on the settings page choose *SSH and GPG
keys*.

Choose *New SSH key*, and paste your SSH public key in the `Key` box
(you created one last week, see `man ssh-keygen`). Give your key a title
if you like, then add it with the green button. Github supports all
common SSH key formats, but will warn you if you do something silly like
upload a private key or a key in an outdated and weak cipher. Some
providers (Bitbucket) insist you use a specific type of key (usually
`ed25519`): add the appropriate flag when generating the key to create
it (`-t ed25519`) if you want that.

If you have many devices (desktop, laptop) that you work from and many
servers (github, gitlab, lab machine etc.) that you connect to, how do
you manage keys?

Whilst using the same public key for different services is not exactly a
security problem: even if one service gets hacked and you connect to it
while it's under the hacker's control, that does not leak your private
key; it feels a bit icky. Generating keys is easy and it is barely any
more work to have separate keys per server and per machine you use.

However, reusing public keys can be a privacy problem, because every
service that you use the same public key (or e-mail address, or phone
number etc.) can potentially work with the others to know that you are
the same individual. It is no problem to use different keypairs for
different services, in which case you probably want a block in your
`~/.ssh/config` file with something like

``` example
Host github.com
    User git
    IdentityFile ~/.ssh/github.com.key.or.whatever.you.called it.
```

Search the manual pages for `ssh_config` for full configuration options.

We are assuming that you will be running the git commands in the rest of
this section on an VM, either on your machine or on a lab machine,
however if you have git installed on your own machine directly (which is
a good idea) then you can run this exercise there too.

## [A note on naming](#a-note-on-naming)

The name of the main branch changes: it used to be called `master`. You
may see the default branch named as either `master` or `main`, or
something else entirely. So long as you are consistent, the name of the
default branch doesn't matter at all (and you can configure it if you
have a preference), and you just need to know that in these exercises we
will use `main` to refer to the default branch and you should substitute
that for your own default branch name if it is different.

## [Create a repository](#create-a-repository)

On the main page, you should see an empty *Repositories* bar on the
left, with a new button. Use that to create a repository, on the next
page give it a name and tick the *Add a README file* box.

On the repository page, there is a green *Code* button. Clicking that
opens a box with three tabs: *HTTPS*, *SSH* and *GitHub CLI*.

Each repository has a two-part name: the first part is the owner's
github username, the second part is the repository name. For example,
the repository for this unit is called `cs-uob/COMS10012`. There are two
ways to interact with a remote repository:

- Via HTTPS. This is ok if you are just cloning a public repository, as
  it does not require any authentication. To interact with a private
  repository or to push files, HTTPS requires username/password
  authentication, and we can do better than that.
- Via SSH, using keys. This is the recommended way to use Git.

Click the SSH tab and copy the URL there—it should be something like
`git@github.com:USERNAME/REPONAME.git`.

On the command line, run the command
`git clone git@github.com:USERNAME/REPONAME.git` where you replace
USERNAME and REPONAME with the parts from the SSH tab of your
repository. Git clones your repository and puts the content in a
subfolder named after the repository name—you can change this by
providing a different folder name as an extra command-line argument to
`git clone`, or you can just move or rename the folder later on.

/Note: certain OS/ISP/DNS combinations might get you "resource
temporarily unavailable" when you try and access github via ssh. The
problem is that the actual address is `ssh.github.com` and not all
set-ups correctly pass on the redirection when you try and connect to
github directly. If you are experiencing this error, you can either use
`ssh.github.com` in place of `github.com`, or add an entry in your
`~/.ssh/config` file as follows (if you have to create this file first,
make sure it is not writable by anyone except yourself or ssh will
refuse to accept it):/

``` example
Host github.com
  Hostname ssh.github.com
  Port 22
```

Go to that folder, and try `git remote show origin`. Here, `origin` is
the default name of a *remote*, and the result should look a bit like
this:

``` example
* remote origin
  Fetch URL: git@github.com:USERNAME/REPONAME
  Push  URL: git@github.com:USERNAME/REPONAME
  HEAD branch: main
  Remote branch:
    main tracked
  Local branch configured for 'git pull':
    main merges with remote main
  Local ref configured for 'git push':
    main pushes to main (up to date)
```

The bits about `main` are to do with branches, which we will in the next
lecture!

# Final super advanced but useful bit

This isn't examined but its useful to know how to do. We're going to
delete a commit, and then try and undelete it. Git makes it **fairly**
hard to truly delete things (provided they've ever been staged or
commited), but if it *is* going to happen it'll likely be when you
rebase something. Fixing it is fiddly so lets practice! You'll need to
read the docs and have a play with a bunch of commands we haven't told
you about. Your task is to read the docs and figure it out!

## Setup

1.  Create a new branch in the repo you're working on.
2.  Add a bunch of commits… more than 3.
3.  Add another commit. Make the commit message and the content
    memorable. *"Here be treasure!"* or something. This is going to be
    the commit you want to recover.
4.  Add a bunch more commits… again more than 3 so it a bit of a
    challenge.
5.  Do a git rebase (`git rebase -i HEAD^7` or
    `git rebase the commit where you branched`) and delete the commit
    you hid with the treasure. Squash some other stuff. Make a real mess
    of your branch.

## Tasks

If you look at your log your *treasure* commit is going to have
vanished. Your task is going to be to recover it. If you can find the
commit id of your missing commit you should be able to `checkout` the
work and get it back.

Task 1  
Find the commit id of the vanished commit. Hope you made the commit
message memorable! Use `git reflog` to see a log of past actions. Do you
know a shell command that you could use to search it?

Task 2  
Restore the commit! What commands do you know to compare the
`diff`-erences between two commits? Could you make a patch to restore
the commit? Do you know what the `cherry-pick` command does?

Task 3  
Let's pretend you can't remember anything about the commit message. From
the root of your Git repo you can find all the objects in it inside
`.git/objects`. They'll be nested inside folders but you can see the
contents with `git cat-file -p ID`.

Starting from the id of a commit you know get a feel for how these
objects are structured and what different kinds might exist… then write
a script to search for your missing commit.

Task 4  
What does the `git gc` command do and why is it going to make this all
*a lot* harder. When does it get run?

# Git forges

Now we are going set up and use a git forge account with a remote provider.  The
*typical* ones you usually see for hosting Git repositories are:

- [github.com](https://github.com)
- [gitlab.com](https://gitlab.com)
- [bitbucket.org](https://bitbucket.org)

But *many* more exist. You can even create your own with little more than an SSH
server. If you do want to build your own git server from scratch you have to
work with *bare* git repos (not covered in this unit) and set some funky file
permissions.  [Instructions can be found here for the
brave.](https://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server)

This exercise is based on GitHub, as it is the most popular provider, but you
can use one of the other two if you want. Although the web user interface and
some advanced features are different, interacting with any of the forges on the
command line is identical and all three offer 'unlimited' private and public
repositories (within certain limits).

## [Set things up](#set-things-up)

Go to [github.com](https://github.com) and register with a username, an
e-mail address and a password. You might have to click a confirmation
link in an e-mail sent to you.

We are going to use GitHub over SSH, so you need to let GitHub know your public
key (remember, you never give anyone your private key!). Click the icon in the
top right corner of the screen that represents your avatar (you can of course
set a custom one if you like) and choose *Settings* in the menu, then on the
settings page choose *SSH and GPG keys*.

Choose *New SSH key*, and paste your SSH public key in the `Key` box
(you created one last week, see `man ssh-keygen`). Give your key a title
if you like, then add it with the green button. Github supports all
common SSH key formats, but will warn you if you do something silly like
upload a private key or a key in an outdated and weak cipher. Some
providers (Bitbucket) insist you use a specific type of key (usually
`ed25519`): add the appropriate flag when generating the key to create
it (`-t ed25519`) if you want that.

If you have many devices (desktop, laptop) that you work from and many
servers (GitHub, GitLab, lab machine etc.) that you connect to, how do
you manage keys?

Using the same public key for different services is not exactly a security
problem: even if one service gets hacked and you connect to it while it's under
the hacker's control, that does not leak your private key. However, reusing
public keys can be a privacy problem, because every service where you use the
same public key (or e-mail address, or phone number etc.) can potentially work
with the others to know that you are the same individual. It is no problem to
use different keypairs for different services, in which case you probably want a
block in your `~/.ssh/config` file with something like

``` example
Host github.com
    User git
    IdentityFile ~/.ssh/github.com.key.or.whatever.you.called it.
```

Search the manual pages for `ssh_config` for full configuration options.

We are assuming that you will be running the Git commands in the rest of
this section on an VM, either on your machine or on a lab machine,
however if you have Git installed on your own machine directly (which is
a good idea) then you can run this exercise there too.

Remember, if you are working on the VMs on the lab machines, contents of the VM
file system will be regularly lost, including SSH keys stored there -- you may
want to store them outside the VM and copy them back into the VM via the
`/shared` folder. 

## [A note on naming](#a-note-on-naming)

The name of the main branch changes: it used to be called `master`. You
may see the default branch named as either `master` or `main`, or
something else entirely. So long as you are consistent, the name of the
default branch doesn't matter at all (and you can configure it if you
have a preference), and you just need to know that in these exercises we
will use `main` to refer to the default branch and you should substitute
that for your own default branch name if it is different.

## [Create a repository](#create-a-repository)

On the main page on GitHub, you should see an empty *Repositories* bar on the
left, with a new button. Use that to create a repository, on the next page give
it a name and tick the *Add a README file* box.

On the repository page, there is a green *Code* button. Clicking that
opens a box with three tabs: *HTTPS*, *SSH* and *GitHub CLI*.

Each repository has a two-part name: the first part is the owner's
GitHub username, the second part is the repository name. For example, the
repository for this unit is called `cs-uob/software-tools`. There are two ways
to interact with a remote repository:

- Via HTTPS. This is okay if you are just cloning a public repository, as it
  does not require any authentication. However, you will not be able to 'push'
changes to a repository cloned this way.
- Via SSH, using keys. This is the recommended way to use GitHub.

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
temporarily unavailable" when you try and access GitHub via ssh. The
problem is that the actual address is `ssh.github.com` and not all
set-ups correctly pass on the redirection when you try and connect to GitHub
directly. **If you are experiencing this error**, you can either use
`ssh.github.com` in place of `github.com`, or add an entry in your
`~/.ssh/config` file as follows (if you have to create this file first, make
sure it is not writable by anyone except yourself or ssh will refuse to accept
it):/

``` example
Host github.com
  Hostname ssh.github.com
  Port 22
```

Once you have cloned your repository, go to the folder created by the `git
clone` command, and try `git remote show origin`.  Here, `origin` is the default
name of a *remote*, and the result should look a bit like this:

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

This is telling you that your local `main` branch gets pushed to the `main`
branch on the remote, which is what you will want. It's also possible to push
other branches to GitHub, and you can instruct Git about which local branch you
want to push to which branch on the remote -- but that won't be necessary for
the moment. 

## [Simple pull-push](#pullpush)

You now have a remote repository on GitHub, and a local repository you can work
in. One of the main reasons to create this setup is for collaboration, which we
cover next week. However, it is worth getting familiar with a standard flow for
synchronising the two repositories. 

First, you need to set an option to indicate a preferred strategy for dealing
with changes from the remote.

``` bash 
git config --global pull.rebase false
```

(There are actually other options to explore for this setting, which we will get
into next week).

- Make a change in your local repository, editing a file and using `git commit`
  to record the changes. Note that nothing automatically happens to the remote
repository -- the version on GitHub remains the same.
- Type `git pull`. This command will fetch updates from the tracked branch on
  the remote repository, and try to merge them. At the moment nothing should
happen -- there are no changes on the remote end. However, it is a good habit to
`pull` remote changes before trying to `push` your own updates.
- Type `git push`. This will push updates from your local repository to the
  remote repository on GitHub. You should be able to view the changes to the
files in GitHub's web interface. 
- Make some more changes in your local repository, and commit them, but do not
  push just yet. 
- In the GitHub web interface, you have some limited functionality to edit
  files. Using the web interface, edit one of the files in your repository (for
now, try to avoid creating a **conflict**, don't edit the same line as you
edited locally).  The interface will let you create a commit message to describe
the change. This change now exists on the remote, but not in your local repo.
- In the terminal, type `git push`. You should see an error message: the `push`
  is being rejected by GitHub because your local repository does not contain
changes that the remote repository does contain. 
- To resolve the issue, simply `git pull`. This should merge the changes from
  the remote into your local repository (with a new merge commit), in much the
same way as you merged branches earlier.  Your local repository is now
up-to-date and you can now `git push` to synchronise the remote.

The above flow is a useful one to get into the habit of -- at the least, it
allows you to back up your work to GitHub. It will also be an important basis
for using GitHub to *collaborate with others*, which will be the focus of next
week's lab.



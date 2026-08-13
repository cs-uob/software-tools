# Git forges

Now we are going set up and use a git forge account with a remote provider.  The
*typical* ones you usually see for hosting git repositories are:

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

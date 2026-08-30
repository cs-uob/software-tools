# Collaborating without shared access

In this exercise, we will demonstrate methods of collaborating on software
projects _without_ everyone having push-access to a repository. This is still a
group activity, and you will need to work with others to test things out.


## Forks and Pull Requests

The first collaboration approach we will cover is one supported by features
built into GitHub and many comparable forges, but not inherent to Git itself.

### Setup

Each group member should create a new *public* repository on GitHub. However,
you should not add the other group members as collaborators -- this is a project
that they cannot `push` changes to directly. 

Make sure there are some files in the repository -- the owner of the repo can
`git clone` the repository via the SSH link, and push some commits to create
some content.


### Forks

Each member of the group should navigate to every other group member's new
repository on the GitHub website (while logged in) and find and click the 'Fork'
button. 

Each fork creates a public copy of the repository under the respective user's
account.  You can see the repositories belonging to you by clicking your user
name at the top of the page, and then _Repositories_. 

Because the fork belongs to _you_, you have write access to it. 

1. Select one of the forked repositories and `git clone` it using the details
   from the _Code->SSH_ tab. You now have a local repository linked to your fork
on GitHub. 
2. Make a minor change, commit, and push the change. You can see the update to
   your fork on GitHub, but the change has not had any impact on the original
version of the repository, which belongs to another user.  

You can now develop as you like on your fork. This is a great way to get
familiar with open-source software: find software you understand on GitHub, fork
the repository, and try to develop it yourself to fix issues or create features
you think are valuable.

### Pull Requests

Once you have committed changes to your fork, you should be able to see a
message at the top of the repository page on GitHub, 

        This branch is [n] commit(s) ahead of USERNAME/REPONAME:main

This tracks how much your fork has diverged from the repository you originally
copied. Because you don't have write access to that repository, if you want
changes from your fork to be incorporated into the original repository, you need
to ask the repository owner to `pull` from your fork. 

There are several ways you could do this in theory (e.g., ring them up and
suggest it), but there is a standardised GitHub interface that almost all
developers will prefer you to use to track these requests.

Next to the message about your fork being ahead, you should see a drop-down
_Contribute_, which exposes the option for you to open a pull request back to
the original repository. If you click on this, you will be prompted to create a
description of your pull request -- this is meant to explain what changes you
have made that you think are deserving of being integrated into the project.
(Different projects may have requirements for how you submit pull requests, so
be sure to read documentation before doing this). After you fill this message
in, you click _Create pull request_ to submit the request.

The repository owner should then see the request on their repository, and the
interface allows them to inspect your changes, and have a conversation with you
about your edits. If they agree with the changes, they can approve the pull and
merge your changes into their repository.

_Practice this workflow, so everyone in your team has forked a repo and
submitted a pull request, as well as handled approving a pull request to a
repository they own._

(Note: You can also use pull requests between branches on the same repository.
Some development teams use pull requests within projects where they all have
shared access, to keep a clear log of how changes from one branch were merged
into another.)


## Applying Patches

The collaboration workflow above is a common one in open-source development, but
not universal. Some developers don't like the reliance on GitHub's web
interface, and want their projects to be more robustly decentralised. A key
development model to learn is how Git can be used to create patches that can be
shared. 

Using the same repositories as above, try the following. 

1. `git clone` your teammate's public repository (that you do not have
    write access to) using the details from _Code->HTTPS_ tab, instead of the
SSH tab we have usually used before now.  
2. Make some changes and commit them locally. Do not attempt to `git push` (this
   won't be permitted). 
3. Invoke `git fetch` to retrieve any changes that might have occurred on the remote
   while you were developing. 
4. Run the command `git format-patch origin/main`. This will create a
   'patchfile' that bundles the difference between your current repository state
and the main branch from the remote. You can see the patch file in your working
directory.
5. Send that file to the repository owner. Solve this problem however you want
   -- send it in an email, attach it to a group chat message. The entire idea
here is that you can share code changes through any mechanism -- you could put
it on a USB drive and attach it to a homing pigeon and the process should still
work.
6. The repository owner, upon receiving the file (and making sure they are up to
   date with their own remote) should be able to apply your patch by running
`git apply [patchfile]`. This will just update the state of their working tree
to what you have suggested in your patch, so they can review the changes. If
they are happy, they can commit your patch (thanking you in the commit message)
and push to the remote.

Through this mechanism, you can contribute to GitHub-hosted projects without
ever having a GitHub account. This is also a useful mechanism for sending edits
to Git repositories that are hosted on private servers without fancy
collaboration UIs -- all it requires is for you to be able to read from the
repository (for the initial `clone` and for fetching and merging subsequent
changes published by the repository owner).

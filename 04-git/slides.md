# Software Tools
(COMS10012 / COMSM0085) 

## Week 4: Version control with Git
(or, "The end of final_v2_final_REALFINAL.c")
 - What is version control?
 - _Why do we want_ version control?
 - An annoying git
 - Using git locally 
 - Branches in history
 - Synchronising your work to GitHub

---

### Version control

Simply: tracking and managing different versions of files.

This arises as a desirable feature in many writing and design tasks (e.g.,
writing a scientific paper), but is particularly desirable for software
projects.

Software to support version control automates part of the work. Typically, at
least identifying and keeping track of the specific differences between versions
of a file, and allowing the user to view the history of changes and revert to
old versions.

---

### Why bother?

For an individual user, version control systems can function as a form of backup
for your work -- an 'undo' button for catastrophic mistakes.

They can also help you:

 - Track your progress and keep a record of how and why decisions were made.
 - Experiment freely with new features or new approaches.
 - Identify which version of your ongoing project is (for example) the version you released to the public 3 months ago.

However, version control systems become most valuable (and necessary) when
dealing with the version differences that arise through *collaboration*.


---

### Code management example

Imagine you are working on a simple, bounded project, like [a web server written
in C](https://github.com/emikulic/darkhttpd). We'll focus on a single function
you've written and released:

```c

static void add_mime_mapping(const char *extension, const char *mimetype) {
    size_t i;
    i = strlen(extension);

    for (i = 0; i < mime_map_size; i++)
        if (strcmp(mime_map[i].extension, extension) == 0) {
            free(mime_map[i].mimetype);
            mime_map[i].mimetype = xstrdup(mimetype);
            return;
        }

    mime_map_size++;
    mime_map = realloc(mime_map, sizeof(struct mime_mapping) * mime_map_size);
    mime_map[mime_map_size - 1].extension = xstrdup(extension);
    mime_map[mime_map_size - 1].mimetype = xstrdup(mimetype);
}
```
---

### Change 1 

As your project is open-source, and popular, people start to write to you
suggesting improvements. 

One person points out that `realloc` should actually be `xrealloc`:

```c

static void add_mime_mapping(const char *extension, const char *mimetype) {
    size_t i;
    i = strlen(extension);

    for (i = 0; i < mime_map_size; i++)
        if (strcmp(mime_map[i].extension, extension) == 0) {
            free(mime_map[i].mimetype);
            mime_map[i].mimetype = xstrdup(mimetype);
            return;
        }

    mime_map_size++;
    mime_map = xrealloc(mime_map, sizeof(struct mime_mapping) * mime_map_size);
    mime_map[mime_map_size - 1].extension = xstrdup(extension);
    mime_map[mime_map_size - 1].mimetype = xstrdup(mimetype);
}

```

---

### Change 2 

A different person finds that a different part of your code could benefit from
tracking the longest extension, and suggests an addition:

```c

static void add_mime_mapping(const char *extension, const char *mimetype) {
    size_t i;
    i = strlen(extension);
    if (i > longest_ext)
        longest_ext = i;

    for (i = 0; i < mime_map_size; i++)
        if (strcmp(mime_map[i].extension, extension) == 0) {
            free(mime_map[i].mimetype);
            mime_map[i].mimetype = xstrdup(mimetype);
            return;
        }

    mime_map_size++;
    mime_map = realloc(mime_map, sizeof(struct mime_mapping) * mime_map_size);
    mime_map[mime_map_size - 1].extension = xstrdup(extension);
    mime_map[mime_map_size - 1].mimetype = xstrdup(mimetype);
}
```
---

### Change 3

Someone else suggests that you start using some `assert` statements to test
your inputs:

```c

static void add_mime_mapping(const char *extension, const char *mimetype) {
    size_t i;
    assert(strlen(extension) > 0);
    assert(strlen(mimetype) > 0);

    i = strlen(extension);

    for (i = 0; i < mime_map_size; i++)
        if (strcmp(mime_map[i].extension, extension) == 0) {
            free(mime_map[i].mimetype);
            mime_map[i].mimetype = xstrdup(mimetype);
            return;
        }

    mime_map_size++;
    mime_map = realloc(mime_map, sizeof(struct mime_mapping) * mime_map_size);
    mime_map[mime_map_size - 1].extension = xstrdup(extension);
    mime_map[mime_map_size - 1].mimetype = xstrdup(mimetype);
}
```
---

### Change 4

Your best friend tries to help by commenting and reformatting your code!


```c
/* Associates an extension with a mimetype in the mime_map.  Entries are in
 * unsorted order.  Makes copies of extension and mimetype strings.
 */
static void add_mime_mapping(const char *extension, const char *mimetype) {
    size_t i;
    i = strlen(extension);

    /* look through list and replace an existing entry if possible */
    for (i = 0; i < mime_map_size; i++)
        if (strcmp(mime_map[i].extension, extension) == 0) {
            free(mime_map[i].mimetype);
            mime_map[i].mimetype = xstrdup(mimetype);
            return;
        }

    /* no replacement - add a new entry */
    mime_map_size++;
    mime_map = realloc(mime_map, 
        sizeof(struct mime_mapping) * mime_map_size);
    mime_map[mime_map_size - 1].extension = xstrdup(extension);
    mime_map[mime_map_size - 1].mimetype = xstrdup(mimetype);
}
```
---

### Why you need version control

All the changes were being suggested by different people each looking at the *original version* of the code and finding different ways to improve it. As the owner, you have to integrate all their suggestions. 

This is just for one function!

Software that will help you **merge** all these different versions with the fewest
headaches is very desirable.

Consider also these cases:

 - You are 3 weeks into developing v2.0 of your software when someone points out a bug that needs fixing urgently in v1.0.
 - You and your friend both want to work on new features for your software independently.
 - You discover one of the contributors to your project is actually an escaped AI known for inserting security vulnerabilities, and you need to track down exactly which edits they are responsible for.

---

### (For the curious)

```c


/* Associates an extension with a mimetype in the mime_map.  Entries are in
 * unsorted order.  Makes copies of extension and mimetype strings.
 */
static void add_mime_mapping(const char *extension, const char *mimetype) {
    size_t i;
    assert(strlen(extension) > 0);
    assert(strlen(mimetype) > 0);

    /* update longest_ext */
    i = strlen(extension);
    if (i > longest_ext)
        longest_ext = i;

    /* look through list and replace an existing entry if possible */
    for (i = 0; i < mime_map_size; i++)
        if (strcmp(mime_map[i].extension, extension) == 0) {
            free(mime_map[i].mimetype);
            mime_map[i].mimetype = xstrdup(mimetype);
            return;
        }

    /* no replacement - add a new entry */
    mime_map_size++;
    mime_map = xrealloc(mime_map,
        sizeof(struct mime_mapping) * mime_map_size);
    mime_map[mime_map_size - 1].extension = xstrdup(extension);
    mime_map[mime_map_size - 1].mimetype = xstrdup(mimetype);
}
```
---

### Version control systems

There are a number of version control systems (sometimes also called 'revision control
systems' or 'source code management systems'). 

Well-known version control systems include:
 - RCS (Revision Control System)
 - CVS (Concurrent Versions System)
 - Subversion (`svn`), 
 - Darcs (Darcs Advanced Revision Control System)
 - Mercurial (`hg`)
 - Fossil 

However, the dominant version control system by a wide margin is Git.

Linus Torvalds initially created Git (in 2005) to manage the development of the Linux kernel. It began auspiciously:

> This is a stupid (but extremely fast) directory content manager.  It
doesn't do a whole lot, but what it _does_ do is track directory
contents efficiently.

A Stack Overflow survey from 2025 suggests ~94% of developers use Git ("the stupid
content tracker"). 

---

### Using git locally

Git tracks directory contents. Any Git 'repository' can be thought of as an official memory
of what a particular directory contained, and how this changed over time (and
timelines). You initialise a repository by calling `git` with the subcommand
`init` inside a directory.

``` bash
mkdir project
cd project
git init .
```

If you are inside a Git repository, you can ask Git about the current status of
the directory relative to that repository's memory.

```bash
git status
```

Initially it will have little to say -- there is nothing in this directory for Git to comment on. If we create a file in the directory and invoke `git status` again, Git will notice this as an 'untracked file': a file it can see in the directory, but has not yet been told to add to the repository. 

```bash
git add hello.txt
```

If we `add` a file, we now have a **staged change** to the repository. We have
queued up a change to the repository, but we have not yet *committed* to this
change being included in the repository history. We might want to edit the file
again before we commit, or `add` some other files as well. But eventually we
must...

```bash
git commit
```

---

### How to commit

Git wants all changes to the repository to be explained. This is implemented
through **commit messages** that you write each time you commit a change. 

To obtain your commit message when you call `git commit`, Git will open your
system's default text editor (usually `vim`) with a file pre-populated with some comment lines
summarising what you've done in this commit. 

You are expected to write a *meaningful summary* of your changes. For serious
development this would mean a short one-line summary followed by a detailed
explanation. For small edits the detailed explanation can be neglected. One-line
commit messages can also be passed directly as an argument, to avoid launching
the text editor:

```bash
git commit -m "Added hello.txt file"
```

After a commit you can check `git status` again and also

```bash
git log
```

This shows the repository history, including the commit IDs, authors, time and
commit messages.

```bash
vim goodbye.txt
git add goodbye.txt
vim hello.txt
git status
```

Edits to tracked files are noticed by Git. There are two options for dealing
with a file that has been modified in the directory: update the repository to
reflect the change, or restore the file to the version the repository knows
about.

---

### How to commit

Despite the file `hello.txt` already being tracked by Git, the explicit command
to stage modifications to this file is still 

```bash
git add hello.txt
``` 

Typing `git add` manually for each change can become tiresome as the number of
files in your project grows. A convenient
option when committing is the `-a` option, which automatically stages all
changes to files that are being tracked by git (i.e., were previously `add`ed) .

```
git commit -a 
```

Note that you still need to `git add` any new files.

---

### Using your repository history

You've seen that the `git log` keeps track of commits and `git status` notices
that a file has changed -- but how can we use this?

First, just comparing the latest version in the repository to our directory
contents, to see what we have done.

```bash
git diff
```
```bash
git restore
```

Second, by comparing against historic file versions:

```bash
git diff [commitID] hello.txt
```

```bash
git restore -s [commitID] hello.txt
```

Note: `git status` here still shows a change to `hello.txt`, why?

---

### Using your repository history


You can also engage in full-on time travel.

```bash
git checkout [commitID]
```

And back to the future:

```bash
git checkout master
```

(On some systems, `main` instead of `master`)

Note that only *tracked files* in the repository are affected. Also watch out for
losing uncommitted changes.

---

### Advanced time travel 



However, linear back-and-forth time travel is *boring*.

```
~~~graph-easy --as=boxart
[ A ] <- why -> [ B ] <- bother? -> [ C ]
~~~
```

What makes things really *interesting* is multiple intersecting *parallel timelines*.

```
~~~graph-easy --as=boxart
[ A ] - this -> [ B ] - is -> [ C ] - super -> [ E ]
[ B ] - gets -> [ D ]
[ D ] - really -> [ E ] 
[ D ] - complex -> [ H ] - and -> [ E ]
[ E ] - confusing -> [ F ]
[ E ] - awesome -> [ I ] - right? -> [ J ]
~~~
```

Most of version control in software development is like the second diagram.

---

### Branches in history

There is a 'default' branch `master` (or `main` -- you can also rename it if you
want). In the single timeline, you simply add commits to this branch, sometimes looking back at a previous
commit to inform your work.

To create a branch called 'notesapp':

```
git branch notesapp
```

To list branches:

```
git branch
```

To switch to a branch:

```
git switch notesapp
```

```
git add notes.txt
git commit
```

Compare branch contents:

```bash
git switch master
ls
git switch notesapp
ls
vim notes.txt
git commit -a
```
---

### Branches in history

If we compare the `git log` on the two branches we can see that the logs
diverge. They are the same up until the point the first branch was created, but
after that they are different. Both 'versions' of the project are being tracked,
but they are separate.

We can create additional branches if we want, to make different, even
contradictory changes. We can add commits to any of our current branches.

So we've created a split in the timeline -- but how do we bring the timelines back
together?

```bash
git switch master
git merge notesapp
```

By invoking `git merge [branch]` we can merge the named branch into the one we
are currently on. This brings all the edits we made in the 'notesapp' branch
over to our 'master' branch. 

In this case, because there is no **conflict**
between what happened in the two timelines (we didn't edit the same lines of any
file differently in different branches), Git is able to automatically manage
this process for us.

We get a new commit for the 'master' branch that keeps
all our changes to 'master' *as well as* the edits from 'notesapp'.  We even see
the `git log` in 'master' now contains the commits from the 'notesapp' branch.
The histories have been merged.

Next week: what to do when there **is** a conflict between the branches.

---

### Git is not GitHub

Git is an open-source tool. GitHub is a proprietary developer platform that
offers services, including the provision of simple way to create *remote (git) repositories*.

#### Why a remote repository? 
You create a copy of your repository that is
publicly accessible, so other people can easily access your code, create their
own versions, and suggest changes. On a Git forge like GitHub (also see GitLab,
SourceHut, etc.) there are often features that help with collaboration.

Git has built-in support for interacting with remote repositories. Two basic
paradigms: 

1. You already have a Git repository with its own history, and want to share it:

```bash
git remote add origin [remote URL]
``` 

2. You are joining a project that already exists:

```bash
git clone [remote URL]
```

---

### Keeping track of the remote

When working with remotes you need to handle the problem of synchronising the two
repositories across the network. 

Committing changes only affects your local repository, it doesn't affect
the remote.

To update your local repository so it matches the remote:

```bash
git pull
```

To update the remote repository so it matches your local one:

```bash
git push
```

Divergent repository histories are handled in a similar manner to divergent
timelines in branches: when pulling changes, you will try to merge the
histories. When you are collaborating with others via a remote, **conflicts** in your changes
are more common.

Most remote repositories will reject attempts to `push` updates when the remote
repository contains changes that aren't in your local history. If this occurs
you need to `pull` the remote changes **first**, resolve the merge, and then
push that updated version.

---

### I am confused

Understanding version control can be difficult. Understanding Git is even more
difficult.

There are **many** different subcommands, tools and different ways of solving
problems within Git. You are not expected to understand all of them.

Focus (this week) on learning:

   1. The core loop of committing your changes to the repository.
   2. How to check and undo changes to your current files using the repository history.
   3. How to create and use a branch, and why you might want to.
   4. How to back up your repository to a remote (like GitHub).

---

### Recap

The crucial commands

#### Core loop
   - Create a new repository with `git init`
   - Tell the repository to track a file with `git add`
   - View the repository status with `git status`
   - Commit changes to the repository with `git commit`
   
#### Using history
   - See the history with `git log`
   - Compare current files to the repository version with `git diff`
   - Restore a current file to the repository version with `git restore`

#### Time travelling
   - Go back to an old version of the directory with `git checkout [commit ID]`
   - Go back to the most recent version with `git checkout master` (or `main`).
   - Create a branch in your timeline with `git branch [name]`
   - Switch to a branch with `git switch [name]`
   - Merge a branch back into your current branch with `git merge [name]`

#### Using remotes
   - Create a copy of a Git remote with `git clone [repository URL]`
   - Connect your existing repository to a new remote with `git remote add origin [repository URL]`
   - Update your local repository to match the remote with `git pull`
   - Update the remote repository to match your (committed) local changes with `git push`

---

### The End

We'll see you in the labs on Friday.



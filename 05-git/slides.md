# Software Tools
(COMS10012 / COMSM0085) 

## Week 5: Collaboration using Git
(or, "Nonviolent conflict resolution")
   - Handling merge conflicts
   - What to track, and what to `.gitignore`
   - Collaboration on shared-access repositories
   - Collaboration without write access
   - Other collaboration tools
   - Advanced timeline management

---

### But first...

Issues from last week?


---

### Recap: Branching & Merging

When you want to take your project in a new direction (e.g., develop a new
feature) it's often a good idea to do this in a branch.

You need to create the branch:

```bash
git branch newidea
```

And also switch to it:

```bash
git switch newidea
```

Then any new commits get added to this 'newidea' branch instead of your default
branch. If you need to go back to the other version you can `git switch`.

This lets you work *simultaneously* on different ideas for how to develop your
work: you can have as many branches as you like.

---

### Recap: Branching & Merging

After your work in a branch reaches a certain stage, you probably want to
integrate the changes into your default branch, to make these changes a core part of your
project.

To handle this you invoke a **merge** operation:

```bash
git switch master
git merge newidea
```

The `newidea` branch still exists after the merge, but doesn't contain unmerged
changes. If you don't want to use it again, you can delete it:

```bash
git branch -d newidea
```

If you decide what you did in the branch 'badidea' was a bad idea, you might
abandon the branch (just never `switch` back to it). If you are confident that
you will never want to see this work again, you can delete a branch even without
merging:

```bash
git branch -D badidea
```

---

### Recap: Branching & Merging

A particularly well-regulated repository might see all updates to the default
branch appear as merges from feature branches.

```
~~~graph-easy --as=boxart
[ init ] ==> { minlen: 2; }[ 96b0f ]{origin: init; offset: 2,0; }==> { minlen: 2; }[ gq74e2 ] ==> []
[ init ] - branch ->  [feat 1] { origin: init; offset: 2,2; }
[ feat 1 ] --> [ 87t3q ] --> [ t6312 ] - merge -> [ 96b0f ]
[ 96b0f ] - branch ->  [feat 2] { origin: init; offset: 2,-2; }
[ feat 2 ] --> [ 6532gh ] - merge -> [ gq74e2 ]
~~~
```

This can help keep track of where updates to the default branch originated.

---
### Merge conflicts

The examples we've looked at so far involve cases where changes on different
branches do not **conflict** with each other.

If this were always the case, we would not need branches! A key benefit of
branches is we can make contradictory decisions in different branches.

In many real merges, you will find that some edits from different branches need
to be resolved. 

Example from last week:

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

### Merge conflicts example: branch 1 (bugfixes)

You make some `commit`s and end up with this:

```c

static void add_mime_mapping(const char *extension, const char *mimetype) {
    size_t i;
    assert(strlen(extension) > 0);
    assert(strlen(mimetype) > 0);

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
    mime_map = xrealloc(mime_map, sizeof(struct mime_mapping) * mime_map_size);
    mime_map[mime_map_size - 1].extension = xstrdup(extension);
    mime_map[mime_map_size - 1].mimetype = xstrdup(mimetype);
}

```

---

### Merge conflicts example: branch 2 (comments)


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

### Merge conflicts example: the merge

```bash
git branch
git merge comments
```

> Auto-merging webcode.c
> CONFLICT (content): Merge conflict in webcode.c
> Automatic merge failed; fix conflicts and then commit the result.

Key developer tip: **READ** output from operations.

Git is telling you that it could not automatically merge, and you need to open
the affected files, manually fix the conflicts indicated there, and then `git
commit` to explain how the conflict was resolved. The files affected are
highlighted in `git status`.

If you ignore this, your code will stop working!

---

### Merge conflicts example: the conflict

```c
/* Associates an extension with a mimetype in the mime_map.  Entries are in
 * unsorted order.  Makes copies of extension and mimetype strings.
 */
static void add_mime_mapping(const char *extension, const char *mimetype) {
    size_t i;
    assert(strlen(extension) > 0);
    assert(strlen(mimetype) > 0);

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
<<<<<<< HEAD
    mime_map = xrealloc(mime_map, sizeof(struct mime_mapping) * mime_map_size);
=======
    mime_map = realloc(mime_map, 
        sizeof(struct mime_mapping) * mime_map_size);
>>>>>>> comments
    mime_map[mime_map_size - 1].extension = xstrdup(extension);
    mime_map[mime_map_size - 1].mimetype = xstrdup(mimetype); 
}
```

Most of the differences across the file are resolved, aside from the line that
was edited differently in different branches. The conflict syntax shows you the
two versions split by `=======` -- you have to make a decision about what to do.

What else might you do here?

---

### Merge conflicts

Remember:
 - Conflicts point to differences you need to resolve by editing files.
 - There can be multiple conflict points in a file, and multiple files with conflicts.
 - Once edits are made, you still need to `git commit` and explain the resolution.
 - Incautious approaches to merging can lose important functionality from branches. 
 - Handling merges well requires you to *understand* both versions (easier for your own branches than contributions from others).

---

### Ignoring files

Commonly, you end up with files in your directory that you do not want to commit to the repository.

Typical examples: `.o` files, executables, logs, other 'output' of your project.

These change all the time, but the changes are not meaningful updates to your
project -- a user or collaborator will regenerate these files themselves from
the source code.

(See also: large binary files (e.g., videos) that cannot be `diff`ed meaningfully).

Solution: a `.gitignore` file in the repository root.

```bash
 *.o
 a.out
 notes/
```

Files matching `.gitignore` patterns will be ignored -- `git status` will not report them as untracked files.

This allows you to keep a 'clean' working repository.

---

### Collaboration with Git

Most meaningful software development involves collaboration (sorry!).

Two common modes for collaborating with Git:

 1. A remote repository that both(/all) collaborators have write (`push`) access to.
 2. A remote repository you can `clone` but cannot `push` to (e.g., most open-source projects).

This week you will be experimenting with both modes.

---

### Collaboration with shared access

In the case where all collaborators have write access to the remote repository:

- All collaborators have a local copy of the remote (e.g., through `git clone [url]`)
- Collaborators independently do local work and `commit` to their own history.
- To synchronise work from the local repository to the remote:
1. `git pull`
2. `git push`

We `pull` first to retrieve any changes from the remote. *Note:* `pull`
carries out two actions -- `git fetch` to retrieve the changes, and then `git
merge`. In some situations you might want to `git fetch` first before you decide
to merge.

If you try to `push` without having merged changes from the remote, your push
will be rejected.

When collaborating like this, you very commonly encounter **merge conflicts**.

This model is very similar to how you work with local branches -- changes go on
'simultaneously' and then are resolved by merging divergent timelines. Rather than simply
being committed as updates to the default branch, resolved versions are `git
push`ed to the remote so they are accessible to all collaborators. 

Note: It's considered very impolite to `push` broken code!

#### Complications
 - pushing/pulling multiple different branches to the remote is possible
 - you can choose to configure Git to do something other than `git merge` when you `git pull`.

---

### Collaboration without shared access

For any large number of collaborators, shared access becomes a bad idea.

Rather than giving lots of strangers write access to your remote, a different
model is used: 

- The canonical remote repository is hosted publicly (e.g., on GitHub)
- To make changes, a collaborator creates a 'fork' (a public copy) as their own remote repository.
- The collaborator makes changes and can `push` to their fork.
- The collaborator then _asks_ the owner to `pull` their changes (a 'pull request'). Features on forges help manage this.
- The owner reviews the suggestion (sometimes with back-and-forth) and then pulls and merges the changes from the fork.

A side-benefit: if the main project is abandoned, or refuses to do something desirable, the community can consider one of the forks to be the canonical copy. Nothing (much) stops you using a fork instead of the original.

For owners/maintainers: you don't need to pay attention to forks until one submits a pull request. You can also turn down or ignore stupid ideas.

You can do this for the unit website: submit pull requests to fix all our errors.

---

### Other collaboration modes

In other non-shared-access models, changes are submitted as 'patches', which can
be delivered e.g., via email.

Very useful for old-school distributed development where you are working against
a private Git server without a fancy pull request UI.

```bash
git fetch
git format-patch origin/main
```

This creates a 'patch file' which shows how your repository differs from the
remote. You can send this file to the person who owns the remote and they can
apply your patch.

```bash
git apply [patchfile]
``` 

This just modifies their directory state to match the changes, which they can
review and then must `commit`. To skip through this, the alternate command to apply a
patch directly as a commit is `git am [patchfile]`.


---

### Advanced chronomancy

So far in your studies of time travel:
 - Moving backwards and forwards in time with `git checkout [commitID]`
 - Retrieving things from the past with `git restore`
 - Creating branches in time with `git branch`
 - Jumping between timelines with `git switch`
 - Merging branches in time with `git merge`

Now: *editing the historical record* with `git rebase`

(Beware, this is a common cause of catastrophic issues with your repository).

---

### Simple rebasing

A common usage is you want to 'update' a branch that split from `master` at an
earlier point, to make it seem like your changes split off the most recent
point.

Going from:


```
~~~graph-easy --as=boxart
[ A ] ==> [ B ] ==> [ C ] ==> [ D ] = master => [ ]
[ B ] --> [ E ] --> [ F ] - branch -> [ ]
~~~
```

To:

```
~~~graph-easy --as=boxart
[ A ] ==> [ B ] ==> [ C ] ==> [ D ] = master => [ ]
[ D ] --> [ E ]{ origin: D; offset: 1,2; } --> [ F ] - branch -> [ ]
~~~
```

You thus 're-base' your branch from commit A to commit D.

---

### Simple rebasing: in practice

You can accomplish this through:

```bash
git switch branch
git rebase master
```

Git will then find the commits in your branch that are missing from `master`,
change your directory state to the current state of `master`, and 're-play' the commits in your branch as if they were changes to that repository.

Then, either:
  1. You are very lucky and this completes without issue, or;
  2. At some point there will be a merge conflict which you will have to fix.


Merge conflicts are presented in the same way as you have seen in `git merge` and `git pull` (`>>>>>` and `<<<<<`), but once they are dealt with, you don't make a new commit for the merge, instead you run:

```bash
git add [file(s)]
git rebase --continue
```

You will then be given the opportunity to edit the commit message for this
change, in case the explanation needs to change as well.

Then, Git will carry on through the rebase process, and find the next conflict for you to solve, until you reach:

> Successfully rebased and updated refs/heads/[branch]

---

### Simple rebasing: in practice

While dealing with conflicts during rebasing, you are also presented with two other options.

To give up on the whole idea:

```bash
git rebase --abort
```

To 'skip' a commit -- to throw away the changes that a particular problematic commit introduced:

```bash
git rebase --skip
```

Note that you are discarding changes! Doing this can create difficult-to-reverse
problems.

---

### More rebasing

You can also use `git rebase` to rebase branches onto *different branches*,
using the `--onto` argument. 

```bash
git rebase --onto master branch subbranch
```

This can be applied to simply remove bad commits from a branch's commit history:

```bash
git rebase --onto master~5 master~3 master
```

```
~~~graph-easy --as=boxart
[ A ] --> [ B ] --> [ C ] --> [ D ] --> [ E ] --> [ F ] - master -> []
~~~
```

```
~~~graph-easy --as=boxart
[ A ] --> [ D ] --> [ E ] --> [ F ] - master -> []
~~~
```




(Q: How is this different from `git revert`?)

---

### Interactive rebasing

To give more overall control and clarity for timeline-editing, you can invoke an *interactive* rebase `git rebase -i`.

This opens your text editor with the 'todo' list that the rebase operation will follow, and allows you to alter it.

Options for each commit include:
 - `pick`: use a commit as normal (only stop if there's a conflict)
 - `reword`: use a commit, but edit the commit message
 - `edit`: use a commit, but stop here for additional edits
 - `squash`: use a commit, but meld it with a previous commit
 - `drop`: remove a commit

It is also possible (if fiddly) to *split* commits during a rebase (see this
week's reading).

---

### I don't want to be a time wizard

Simple rebasing is often necessary when working on large, rapidly-moving
software projects. Some projects/teams require rebasing of contributions to
create a more linear timeline. 

(If you want to adopt this: rather than running a `merge` as the default action
when you `git pull`, you can have Git try to `rebase` your local commits on top of the changes
from the remote by setting the `pull.rebase` option.)

Many rebasing features are useful for collapsing and rationalising messy commit
histories, so that proposed changes can be more easily understood.

Sometimes your commits can be embarrassing 

```bash 
git commit -am "My laptop was running low on battery"
```

Sometimes you made back-and-forth changes as you were debugging an issue.

Like "writing meaningful commit messages", rebasing is most wanted when working in *collaboration*, but has other benefits.

---

### Recap

We covered:
 - Branching, merging and resolving merge conflicts.
 - Collaboration with shared access (`clone`, `pull`, `push`)
 - Collaboration without write access ('forking' and 'pull requests')
 - Collaboration through patches (`format-patch`, `apply`, `am`)
 - Timeline editing (`rebase`)


---

### The End

We'll see you in the labs on Friday.



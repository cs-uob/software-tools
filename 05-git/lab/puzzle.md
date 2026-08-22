
## An advanced puzzle 

The following material relies on researching some deeper, trickier aspects of
how Git works. This material isn't examinable, but it is useful for those of you
trying to deepen your understanding.  We are going to delete a commit, and then
try and *undelete* it.  Git makes it fairly hard to truly delete things
(provided they've ever been staged or committed), but if it *is* going to happen
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

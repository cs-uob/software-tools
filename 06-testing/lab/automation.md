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
yourself introducing bugs that might otherwise have escaped your notice because
you forgot to run your tests.  If for some reason you need to make a commit
_despite_ your code being broken, you can skip the check with `git commit
--no-verify`. If you want to disable the check entirely (why?), you can just
delete the script.


## Testing as a GitHub Action

A pre-commit hook is something a good developer can use locally to automate
testing. However, for a project involving multiple developers, this might not be
enough -- your group project members might fail to set up the hooks, or skip the
checks, and push broken code to your shared repository.  While the `git log`
will show that the negligent team member is responsible for the bad commit when
it is later identified, it is often beneficial to have your central repository
run your test suite _each time a change is pushed_, and prominently display the
current test status of your project.

Then, when "YouKnowWho" pushes a bad commit to the shared repository, everyone
can see from the web interface (and email notification) that the tests are
currently failing (so they don't get confused and think the issue is something
in their own code) and knows who to blame.

On GitHub, the mechanism for this is called GitHub Actions.  

### Pushing an existing repository to GitHub

Because we started our work offline, and now want to work with GitHub, we are
first going to upload your calculator repository to GitHub. This isn't necessary
if we started out by using `git clone` for our repository.

On GitHub, create a new repository for your calculator library by going to
_Repositories_ and then _Add New_, and giving it a name. It's up to you whether
this repository should be public or private, but **do not** click any of the
GitHub toggles that create a file like a README.

Then, from the commandline inside your local repository run

```bash
git remote add origin git@github.com:[USERNAME]/[REPONAME].git
git push -u origin main
```

Where USERNAME is your GitHub account name and REPONAME is the name you came up
with for this repository. You should find that the push goes through and you can
now see your `calc.c` and `test.c` files in the GitHub file viewer for this
repository.

### Adding a workflow

Within your local repository, run

```bash
mkdir -p .github/workflows
```

Then, create the file `.github/workflows/tests.yml`, with the following content:

```yaml
name: Compile and Test Under Unity

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:

      - name: Checkout your code
        uses: actions/checkout@v7
        with:
          path: main

      - name: Checkout Unity
        uses: actions/checkout@v7
        with: 
          repository: ThrowTheSwitch/Unity
          path: unity

      - name: Set up GCC
        run: sudo apt-get install -y gcc

      - name: Compile tests 
        run: gcc -I unity/src/ main/test.c unity/src/unity.c -o tests

      - name: Run tests
        run: ./tests
```

This is a 'workflow' that will be executed by GitHub under certain conditions.
The first part, under `on:` says that these jobs will run whenever someone
pushes to the `main` branch, or whenever there is a pull request for that
branch.

Under `jobs:`, the `build` jobs describes what should happen, with named steps.
First, it specifies that GitHub should use the latest version of Ubuntu as the
test server environment.  Then: 
    - one step checks out the latest version of your repository into a directory `main`, 
    - another step checks out the Unity testing suite into a directory `unity`. 
    - In another step, we make sure `gcc` is installed on this VM
    - Then we compile the tests. Note that this is done a little differently
      than we have been doing it locally -- we are compiling against the Unity
source files rather than installing it as a library on the GitHub test VM. This
_should_ be equivalent. 
    - Finally, we get GitHub to run the test executable. 


To test this out, first `git add` the .yml file you created, commit the change,
and then `git push`. Open the repository webpage on GitHub fast enough and you
should see an indication that GitHub is doing something -- you can track this by
going to the _Actions_ tab and expanding the job. You can watch as the build
process takes place and each of our steps from the workflow is ticked off.
Because you have tested your code locally, you should see that every stage
passes, and you get a pleasant green tick next to your commit message.

Now, check what happens when something goes wrong. There are two cases to
consider:

1. Make changes and push some more commits that would cause your tests to fail
   (you will have to use `--no-verify` to skip your pre-commit hook).  Watch
what happens on GitHub once you push the broken code.
2. Make some more changes that would mean the code doesn't even compile -- a
   syntax error like missing a semicolon. See the difference in the log of
actions on GitHub.

Just like the pre-commit hook, workflows are very flexible and can be adopted
for a wide variety of projects, in different languages and frameworks. GitHub
even provide [a number of
examples](https://docs.github.com/en/actions/tutorials/build-and-test-code) for
how to create workflows for testing different projects under different
frameworks.

That's it! You now have a mechanism you may find very useful for group coding
work in the future: the first thing to set up on your shared repository is a
testing workflow that keeps track of which commits do or don't pass the tests. 

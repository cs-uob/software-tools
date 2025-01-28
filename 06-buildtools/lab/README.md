# Build Tools

## Part 1: Building C code from source

In this exercise you will practice the traditional way of building C
projects from source. We are going to use the sqlite database as an
example project to build.

Download the source file [https://sqlite.org/2021/sqlite-autoconf-3340100.tar.gz](https://sqlite.org/2021/sqlite-autoconf-3340100.tar.gz) into your VM with `wget` or similar and extract it with `tar zxvf FILENAME`. This creates a subfolder, do a `cd` into it.

![XKCD comic pointing out that tar has a weird UI.](https://imgs.xkcd.com/comics/tar.png)

What's that weird `zxvf` bit in the `tar` command?  _Read the man pages_; but it is an older convention for passing command flags that lives on in a few commands.  The `z` means decompress it with `gunzip` first, `x` is for extract, `v` is for verbose (list the files it is expanding) and `f` is for read the archive from a file as opposed to standard input. 

You can see a file called `INSTALL` which you can open in a text editor to find the standard instructions:

> Briefly, the shell commands `./configure; make; make install` should configure, build, and install this package.

## Configure

If you look at the first line of the configure script, it starts `#! /bin/sh` as that path should be valid on just about any vaguely posix-compatible system. The whole thing is just over 16000 lines, so you don't want to read all of it.

Run the script with `./configure`. You can see that it does a lot of checking, including things like:

  - Whether your system has a C compiler.
  - Whether your C compiler is gcc.
  - Whether your C compiler actually works.
  - Whether standard headers like `string.h` or `stdlib.h` exist.
  - Whether the readline library is installed on your system.

Your configure script should run through and print `creating Makefile` on one of its last lines.

The configure script is basically a collection of tests for every single bug and oddity found on any system known to the autoconf developers that could break the build. For example, someone once reported a bug in a build on Sun OS 4 (released in 1988), so in lines 2422 and following of the configure script we read

    # Use test -z because SunOS4 sh mishandles braces in ${var-val}.
    # It thinks the first close brace ends the variable substitution.
    test -z "$INSTALL_PROGRAM" && INSTALL_PROGRAM="${INSTALL}"

## Make

Type `make` to build sqlite. If it's not installed, `sudo apt install make` will fix that.

Some of the compiler commands might take a while to run. While they're running, note the number of configuration variables (everything passed with a `-D`) involved; some of them turn on/off features (for example readline support is off if it can't find the header files for it on your system) and some of them set options specific to the operating system and compiler, for example `-DHAVE_STRING_H` defines whether `string.h` exists on your system.

These translate to `#ifdef` commands in the source files, for example in `shell.c` starting at line 121 we include readline, if the header files exist:

    #if HAVE_READLINE
    # include <readline/readline.h>
    # include <readline/history.h>
    #endif

The last command run by the makefile is

    gcc [lots of options] -g -O2 -o sqlite3 sqlite3-shell.o sqlite3-sqlite3.o -lreadline -lcurses

This should build an executable `sqlite3` that you can run (use `.q` to quit again).

## Installing

If you want to, you can now type `make install` to copy the executable
to `/usr/local/bin`; but you'll probably find it fails with
permissions issues.  Turns out *most* user's aren't allowed to install
software for everyone.

So what do you do?

- You could install using the `root` user who is allowed to install to
  the system directories: `sudo make install`
  - But on the lab machines you aren't allowed to use `sudo`…
- You could install it somewhere else.  Clean out your build and try
  rerunning `./configure` with `--prefix=${HOME}/.local/` first!

## What to do if it doesn't build?
What do you do if it says it can't find a `.h` file, or can't link it
to a library file (a `.so`)? C predates modern languages with package
managers, so it probably means you haven't installed a library the
code depends on.  Luckily `apt-file` on Debian-based systems can be
really helpful here: run `apt-file search <name of file>` to find out
which package provides the file you're missing and install it.

I was trying to build a package that was complaining it couldn't find
a library `libffi.so`: what package might have provided it?

Try not to panic if the software you're building won't build cleanly!
Read the error message and fix the bug.  Normally installing a
library, or altering a path in the source code is enough to fix it.
Being able to fix simple bugs yourself is what makes Linux (and other
OSs) really powerful!

# Python

The Python programming language comes with a package manager called
`pip`.  Find the package that provides it and install it (**hint**:
how did we find a missing library in the C build tools?).

We are going to practice installing the
[mistletoe](https://github.com/miyuchina/mistletoe) module, which
renders markdown into HTML.

  - In python, try the line `import mistletoe` and notice that you get `ModuleNotFoundError: No module named 'mistletoe'`. 
  - Quit python again (Control-d) and try `pip3 install --user mistletoe`. You should get a success message (and possibly a warning, explained below).
  - Open python again and repeat `import mistletoe`. This produces no output, so the module was loaded.

Create a small sample markdown file as follows, called `hello.md` for example:

    # Markdown Example

    Markdown is a *markup* language.

Open python again and type the following. You need to indent the last line (four spaces is usual) and press ENTER twice at the end.

    import mistletoe
    with open('hello.md', 'r') as file:
        rendered_file = mistletoe.markdown(file)
        print(rendered_file)

This should print the markdown rendered to HTML, e.g.

    <h1>Markdown Example</h1>\n<p>Markdown is a <em>markup</em> language.</p>


## Python versioning hell
Python version 3 came out in 2008 and has some syntax changes compared
to Python 2 (`print "hello world"` became `print("hello
world")`). Version 2 is now considered deprecated; but the transition
was *long* and *extremely painful* because changing the syntax of a
thing like the print statement leads to an awful lot of code breaking
and an awful lot of people preferring not to fix their code and
instead just keep an old version of Python installed.

So whilst we were dealing with this it was typical for a system to
have multiple versions of Python installed `python2` for the old one
and `python3` for the newer on (and even then these were often
symlinks to specific subversions like `python2.6`), and then `python`
being a symlink for whatever your OS considered to be the "supported" version.

Different OSs absolutely had different versions of Python (MacOS was
particularly egregious for staying with Python 2 for far longer than
necessary) and so a solution was needed, because this was just
breaking things while OS designers bickered.

The solution is that for *most* dependencies (except for compiled
libraries) we generally use a programming language's own package
manager and ignore what the OS provides.  For Python that means `pip`
(occasionally called `pip3` or `pip2`).

Sometimes you'll see things telling you to install a package with
`sudo pip install` but don't do that! It will break things horribly
eventually.  You can use pip without sudo, by passing the `--user`
option which installs packages into a folder in your home directory
(`~/.local`) instead of in `/usr` which normally requires root
permissions.

Sometimes you'll still need to install a package through the OSs
package manager (`numpy` and `scipy` are common because they depend on
an awful lot of C code and so are a pain to install with `pip` as you
have to fix the library paths and dependencies manually) but in
general try and avoid it.

Python used to manage your OS should be run by the system designers;
Python used for your dev work should be managed by you.  And never the
twain shall meet.

## Scipy

In Maths B, you will be using `scipy` for statistics, so you may as
well install that too. Unfortunately, `pip` will complain because
scipy depends on a C library for fast linear algebra. You could go and
install all the dependencies (and you might have to do this if you
need a specific version of it), but it turns out Debian has it all
packaged up as a system package too: if it is at the version you need
you could install that instead.  Try searching for it with `apt search
scipy`.

The following commands show if it is correctly installed, by sampling
5 times from a Normal distribution with mean 200 and standard
deviation 10:

    from scipy.stats import norm
    norm(loc=200, scale=10).rvs(5)

This should print an array of five values that are not too far off 200
(to be precise, with about 95% confidence they will be between 180 and
220 - more on this in Maths B later on).

## Avoiding sudo

If you need to install libraries you might be tempted to install them
for all users by using `sudo pip` but this can lead to pain!  If you
alter the system libraries and something in the system depends on a
specific version of a library then it can lead to horrible breakage
and things not working (in particular on OSs like Mac OS which tend to
update libraries less often).

Python comes with a mechanism called
[venv](https://docs.python.org/3/library/venv.html) which lets you
create a virtual python install that is owned by a user: you can alter
the libraries in that without `sudo` and without fear of mucking up
your host system.  Read the docs and get used to using it---it'll save
you a world of pain later!

- `pip freeze | tee requirements.txt` will list all the packages your using and what version they are and save them in a file called `requirements.txt`.
- `pip install -r requirements.txt` will install them again!

This makes it *super easy* to ensure that someone looking at your code has all the right dependencies without having to reel off a list of _go install these libraries_ (and will make anyone whoever has to mark your code happy and more inclined to give you marks).

# Java

In the Java world,

  - The `javac` compiler turns source files (`.java`) into `.class` files;
  - The `jar` tool packs class files into `.jar` files;
  - The `java` command runs class files or jar files.

A Java Runtime Environment (JRE) contains only the `java` command, which is all you need to run java applications if you don't want to do any development. Many operating systems allow you to double-click jar files (at least ones containing a special file called a `manifest`) to run them in a JRE.

A Java Development Kit (JDK) contains the `javac` and `jar` tools as well as a JRE. This is what you need to develop in java.

`maven` is a Java package manager and build tool. It is not part of the Java distribution, so you will need to install it separately.

You can do this exercise either in your VM, or on your own machine where you have probably already installed Java for the OOP/Algorithms unit, and you can use your favourite editor. The exercises should work exactly the same way in both cases, there is nothing POSIX-specific here.

## Installing on Debian

On Debian, install the `openjdk-17-jdk` and `maven` packages. This
should set things up so you're ready to go but if you have _multiple
versions_ of Java installed you may need to set the `JAVA_HOME` and
`PATH` variables to point to your install.

For example:

```sh
export JAVA_HOME='/usr/lib/jvm/java-17-openjdk'
export PATH="${PATH}:${JAVA_HOME}/bin"
```
|||advanced
Debian also has a special command called `update-alternatives` that
can help manage alternative development environments for you.  Read
the manual page!
|||

## Installing on your own machine

Use whatever package manager your OS comes with.  If you can't and
have to install it manually:

  - download the [OpenJDK](http://openjdk.java.net/) distribution
  - unzip it somewhere
  - add the binaries folder to your `PATH`
  - set the `JAVA_HOME` variable to point to the folder where you unzipped the JDK.

To install maven, [follow these instructions](https://maven.apache.org/install.html) which again involve downloading a ZIP file, unzipping it somewhere and then putting the `bin` subfolder on your `PATH`.

Note: `JAVA_HOME` must be set correctly for maven to work.

## Running maven

Open a shell and type `mvn archetype:generate`. This lets you _generate an artifact from an archetype_, which is maven-speak for create a new folder with a maven file.

_If you get a "not found" error, then most likely the maven `bin`
 folder is not on your path. If you're on a POSIX system and have used
 your package manager, this should be set up automatically, but if
 you've downloaded and unzipped maven then you have to `export
 PATH="$PATH:..."` where you replace the three dots with the path to
 the folder, and preferably put that line in your `~/.profile` too._
 
The first time you run it, maven will download a lot of libraries.

Maven will first show a list of all archetypes known to humankind (3046 at the time of counting) but you can just press ENTER to use the default, 2098 ("quickstart"). Maven now asks you for the version to use, press ENTER again.

You now have to enter the triple of (groupId, artifactId, version) for your project - it doesn't really matter but I suggest the following:

    groupId: org.example
    artifactId: project
    version: 0.1

Just press ENTER again for the following questions, until you get a success message.

Maven has created a folder named after your artifactId, but you can move and rename it if you want and maven won't mind as long as you run it from inside the folder. Use `cd project` or whatever you called it to go inside the folder.

If you're in a POSIX shell, then `find .` should show everything in the folder (in Windows, `start .` opens it in Explorer instead):

    .
    ./src
    ./src/main
    ./src/main/java
    ./src/main/java/org
    ./src/main/java/org/example
    ./src/main/java/org/example/App.java
    ./src/test
    ./src/test/java
    ./src/test/java/org
    ./src/test/java/org/example
    ./src/test/java/org/example/AppTest.java
    ./pom.xml

This is the standard maven folder structure. Your java sources live under `src/main/java`, and the default package name is `org.example` or whatever you put as your groupId so the main file is currently `src/main/java/org/example/App.java`. Since it's common to develop Java from inside an IDE or an editor with "folding" for paths (such as VS code), this folder structure is not a problem, although it's a bit clunky on the terminal.

## The POM file

Have a look at `pom.xml` in an editor. The important parts you need to know about are:

The artifact's identifier (group id, artifact id, version):

```xml
<groupId>org.example</groupId>
<artifactId>project</artifactId>
<version>0.1</version>
```

The build properties determine what version of Java to compile against (by passing a flag to the compiler). Unfortunately, the default maven template seems to go with version 7 (which for complicated reasons is called 1.7), but version 8 was released back in 2014 which is stable enough for us, so please change the 1.7 to 1.8 (there are some major changes from version 9 onwards, which I won't go into here):

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

The dependencies section is where you add libraries you want to use. By default, your project uses `junit`, a unit testing framework - note that this is declared with `<scope>test</scope>` to say that it's only used for tests, not the project itself. You do not add this line when declaring your project's real dependencies.

```xml
<dependencies>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.11</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

The `<plugins>` section contains the plugins that maven uses to compile and build your project. This section isn't mandatory, but it's included to "lock" the plugins to a particular version so that if a new version of a plugin is released, that doesn't change how your build works.

The one thing you should add here is the `exec-maven-plugin` as follows, so that you can actually run your project:

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>exec-maven-plugin</artifactId>
    <version>3.0.0</version>
    <configuration>
        <mainClass>org.example.App</mainClass>
    </configuration>
</plugin>
```

The important line is the `mainClass` which you set to the full name (with path components) of your class with the `main()` function.

## Compile, run and develop

`mvn compile` compiles the project. The very first time you do this, it will download a lot of plugins, after that it will be pretty fast. Like `make`, it only compiles files that have changed since the last run, but if this ever gets out of sync (for example because you cancelled a compile halfway through) then `mvn clean` will remove all compiled files so the next compile will rebuild everything.

The `App.java` file contains a basic "Hello World!" program (have a look at this file). You can run the compiled project with `mvn exec:java` if you've set up the plugin as above. After you've run it the first time and it's downloaded all the files it needs, lines coming from maven itself will start with `[INFO]` or `[ERROR]` or similar, so lines without any prefix like that are printed by your program itself. You should see the hello world message on your screen.

The development workflow is now as follows: you make your edits, then run `mvn compile test exec:java` to recompile, run your tests, then run the program. (Like `make`, you can put more than one target on a command, separated by spaces.)

`mvn test` runs the tests in `src/test/java`. There is an example test already created for you (have a look).

`mvn package` creates a jar file of your project in the `target/` folder.

I assume that you will be storing your Java projects in git repositories. In this case, you should create a file `.gitignore` in the same folder as the `pom.xml` and add the line `target/` to it, since you don't want the compiled classes and other temporary files and build reports in the repository. The `src/` folder, the `pom.xml` and the `.gitignore` file itself should all be checked in to the repository.

_Exercise: make a change to the Java source code, then recompile and run with maven._

## Adding a dependency

[Thymeleaf](https://www.thymeleaf.org/) is a Java templating library. It lets you write a template file or string for example (depending on the syntax of your library)

    Hello, ${name}!

which you can later render with a particular name value. This is one of the standard ways of creating web applications, for example to display someone's profile page you would write a page template that takes care of the layout, styles, links etc. but uses template variables for the fields (name, email, photo etc.) which you render when someone accesses the profile page for a particular person. You will see this in more detail in your SPE project next year.

To use Thymeleaf or any other library, you first have to add it to your pom file. Go to [mvnrepository.org](https://mvnrepository.org) and search for Thymeleaf, then find the latest stable ("release") version. There is a box where you can copy the `<dependency>` block to paste in your pom file. The next `mvn compile` will download thymeleaf and all its dependencies.

Next, make a template file called `unit` in the folder `src/main/resources/templates` (you will have to create the folder first), and put the following lines in it:

    Unit: [(${name})]

    In this unit, you will learn about:

    [# th:each="topic: ${topics}"]
      - [(${topic})]
    [/]
    
This is thymeleaf "text" syntax, where the first line renders the value of a variable and the third-from-last line is the template equivalent of a 'for' loop that renders its contents once for each element in a list (or other collection data structure).

Thymeleaf needs to know where to find its template files, and in this example we are going to demonstrate loading resources from the classpath because that is the correct way to work with resources in a java application (there are special considerations for web applications, but they usually end up using the classpath in the end anyway).

In your Java source file, you can now do the following. First, the imports you will need:

```java
import java.util.List;
import java.util.Arrays;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
```

And the code:

```java
ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
resolver.setTemplateMode(TemplateMode.TEXT);
resolver.setPrefix("templates/");

TemplateEngine engine = new TemplateEngine();
engine.setTemplateResolver(resolver);

Context c = new Context();
c.setVariable("name", "Software Tools");
List<String> topics = Arrays.asList("Linux", "Git", "Maven");
c.setVariable("topics", topics);
String greeting = engine.process("unit", c);

System.out.println(greeting);
```

Compile and run this, and you should see:

    Unit: Software Tools

    In this unit, you will learn about:
    
      - Linux
      - Git
      - Maven

Let's look at how the code works.

  1. A template resolver is a class that finds a template when you give it a name (here: "unit"). In this case we use a resolver that loads off the classpath, so we just have to put the template files somewhere under `src/main/resources`; we tell it that we want the template files treated as text (e.g. not HTML), and that the template files are in a subfolder called `templates`.
  2. The template engine is the class that does the work of rendering the template, once the resolver has found the source file. 
  3. To render a template, you need a template name for the resolver to look up, and a context - an object on which you can set key/value parameters. In this case we're setting the key "name" to "Software Tools" and the key "topics" to a list of three topics. The names and types of keys obviously have to match what's in the template file.

_Exercise: rewrite this example to be a bit more object-oriented by creating a unit class:_

```java
public class Unit {
    private String name;
    private List<String> topics;
    public Unit(String name, List<String> topics) {
        this.name = name;
        this.topics = topics;
    }
    public String getName() { return this.name; }
    public List<String> getTopics() { return this.topics; }
}
```

_You will still need one single `setVariable` call, and in the template the syntax `[(${unit.name})]` should translate into a call to the getter._


## Modern Java
More recent releases of Java have wonderful things called `records`
that make your life *a lot* easier.  All that above code translates to just:

```java
public record Unit(String name, List<String> topics) {}
```

Unfortunately support for more recent Java releases is a bit spotty
(and worse in the _real_ world).  You'll need to get rid of the
`maven.compiler.target` and `maven.compiler.source` bits you added in
your pom.xml and replace it with a new:

```
<maven.compiler.release>17</maven.compiler.release>
```

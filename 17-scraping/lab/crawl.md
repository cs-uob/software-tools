# Crawling the Web

So far in this unit we've had you use `wget` only for one of its simplest
use-cases: when you want to download a single file from the web. Consistent with
the Unix philosophy that tools should 'do one thing well', `wget` is capable of
a lot more than this.

To demonstrate this, we're going to have you first run a server to deploy a
website locally, and then test out various `wget` options by connecting to that
server via localhost. This of course doesn't mean that `wget` can only do these
things via localhost -- it's designed to work with real websites -- but we
decided that getting ~200 students to test out web-crawling on a particular live
website was probably not a great idea, so we're having each of you run your own.

### Set up the server

As with the HTTP exercises, it would be best to either carry out these steps directly on a lab machine
or on your own machine (optionally from the Debian Linux VM with ports forwarded). If you are using 
a lab machine via SSH instead then you'll need to open a second SSH session _to the same lab machine_ 
in another terminal, to act as a client for the next parts of the exercise.
However, we'll periodically invite you to check things in your browser, which is
a lot simpler if you're not trying to use a remote machine.

First, download the [webpages to be served by the webserver](/cattax.tar.gz). 
(If you like you can even do this using `wget`).

Then extract the contents of the tarball by using `tar -xzf cattax.tar.gz` in the
folder you downloaded it to. This will create a folder `cattax` which contains some
webpages and resources.

Next, use the `darkhttpd` server from a previous week's exercises to
serve the content of the `cattax` folder on `localhost:8080`. _(Refer to the
HTTP week's exercise instructions if you have forgotten how to do this)_. 

You can check that this is working in a browser (unless you are connecting via
SSH) by navigating to `localhost:8080/index.html` -- you should see a webpage
talking about **Felidae**. You'll need to leave this server running -- the
simplest way forward would be to open another terminal for the steps below.
_(Alternatively: use your shell expertise to figure out how to run the server in
the background without its output interfering with the rest of what you're going
to be doing in this terminal)._

### Single-page download

To keep your filesystem tidy, we're going to work within a 'client' folder.
We'll be repeatedly downloading files and sometimes deleting them, and you'll
neither want lots of duplicated webpages littering your filesystem nor want to
run `rm *` in a directory that possibly contains files you don't want deleted.

Make sure you are in the parent directory that contains `cattax` (i.e., you can
type `ls` and see the directory `cattax` in the output) and _not inside_
`cattax` itself. Then create a directory and move into it:

```bash
mkdir client
cd client
```

Now we'll start with the simple use of `wget` you have already become familiar
with:

```
wget localhost:8080/index.html
```

This downloads the same `index.html` as is being served from `cattax` by
`darkhttpd`. However, if you open this downloaded file in your browser, you'll
see that there's a sense in which something missing -- `wget` has only
downloaded the specific HTML file you requested, and not any of the resources
that the page itself references, like the CSS file -- so the version you open in
your browser from your `client` directory won't look the same as the version
being served via localhost. This can be desirable default behaviour (we only
asked it to get that page, after all), but if we wanted to download a copy of a
webpage and later read that webpage's copy with the styles and images it was
originally created to contain, we'd need to get `wget` to also download these
resources.

One way to do this would be to manually identify each of the required resources
and download them one-by-one. But this is tedious, repetitive work -- highly
suited to automation -- and moreover, `wget` can save us the effort. Try the
following, and **read the output**.

```
wget -p localhost:8080/index.html
```

Notice that this time `wget` downloaded multiple files. It also created a
directory named `localhost:8080` to store all the files in. This is helpful
organisation if you're ever using `wget` to download pages from multiple
different websites -- it stores them under directories named after the domain
you requested them from. 

If you read the output carefully you'll notice that as well as the `index.html`
we requested directly, `wget` has also downloaded the `catstyle.css` file
referenced in that page, and another file called `robots.txt` that you didn't
ask for and which isn't mentioned in `index.html`. This 'robots' file is part of
a standard for responsible web crawling, and tells crawling tools which parts of
a website they are or aren't allowed to visit. When you use `wget` to crawl a
webpage or website it will check the site's `robots.txt` to understand which
resources it may not be allowed to download. You can read more about how these
files are written
[here](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt). 

Open the `index.html` file from the new `localhost:8080` folder that was
created, and you should see that it looks just like the version you got in your
browser by navigating to the URI `localhost:8080/index.html`. _(There are some
cases where this wouldn't be true for a webpage -- wget can sometimes not be
permitted access to some resources required to display a page the same way as it
is shown in your browser)._

### Crawling a site

The version of the webpage you downloaded using the previous command still has
one major flaw: the links on the page don't work. Or, rather, the links to the
'Felinae' and 'Pantherinae' pages are broken, because those links are made
relative to the webpage, and the corresponding files don't exist in the client's
folder.  The link to Wikipedia in the page footer _does_ still work, because the
`href` attribute of that link is set to a full URI.

What do we do if we want to download more than one webpage from a site? Wget
supports something called 'recursive downloading'. Simply put, when used in this
manner it will follow all links internal to a site and download the resources
displayed at those links, storing a copy locally and creating a directory
structure if necessary. One version of this recursion is to use the `-r` (or
`--recursive`) option, which downloads all linked pages up to a certain maximum
depth. Try this out:

```
wget -r -l 1 localhost:8080/index.html
```

This downloads recursively with the 'level' (maximum depth of recursion) set to
1 level of recursion. You should see that both the requested `index.html` and
the two pages linked from that resource have been downloaded, along with
`robots.txt`. Notice as well that the Wikipedia page has not been downloaded --
it's not hosted at `localhost:8080`, so `wget` ignores it, and the link will
work from the downloaded page anyway.  Our two newly-downloaded pages, however,
will contain dead links to other pages, because we limited the depth of
recursion to just one hop.  If we increase this:

```
wget -r -l 2 localhost:8080/index.html
```

You'll see that a _lot_ more files get downloaded. These are only very small,
simple web-pages, without many links (contrast, for example, any given Wikipedia
page). Very short recursion depths can capture an awful lot of a domain, and if
you ever tell `wget` to crawl links without caring about which domain they
belong to, this becomes explosively worse (`-l 2` in such a case for our
`index.html` would involve
downloading everything linked from the Wikipedia page referenced in the footer
-- several hundred resources).  In the case of our cattax website, however,
there are still a few pages that are more than 2 steps away from the index page.
Let's start afresh:

```
rm -r localhost:8080
wget -m localhost:8080/index.html
```

The `-m` flag is designed to provide some sensible defaults for 'mirroring' an
entire website (something you might do if you wanted to keep a copy of it for
offline browsing, or for providing a public backup of a valuable resource). It
sets the recursion level to infinite and checks timestamps before downloading
files, as well as setting a few more configuration settings. For many cases
where you might want to download an entire website, this is the flag you would use --
perhaps also with a polite `-w 1`, which sets a 1-second delay between requests,
to avoid over-burdening the server if the website is large.


## Further Exercises
 1. Read `man wget` to understand what the `-i` `--force-html` and `--spider`
    options do. Download a copy of this webpage (the one you are currently
reading) and use `wget` to test all the links on the page. Are there any broken
links?
 2. Tell `wget` to use a different user agent string in a request to your server running
on localhost. Check what the request looks like to your server.
 3. How would `wget -r -l 1 http://example.com` differ from `wget -p
    http://example.com`? _(Hint: think about external resources)_.  
 4. Look for 'Recursive Accept/Reject options' in the `wget` manpage. How would
    you get `wget` to crawl pages from multiple different domains?
 5. Look up what `-nc` does. What is clobbering, and why would or wouldn't you
    want to do it?

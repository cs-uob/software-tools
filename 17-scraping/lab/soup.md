# BeautifulSoup

Previously in this unit we have taught you how to construct webpages, including how
to construct webpages so that they present structured information (e.g., the
contents of a database). The presumption has generally been that you are
designing webpages for (usually visual) consumption by a human using a standard
web browser, or at most writing Javascript functions that will help a human use
a webpage in particular way. 

However, there are situations where you may need to write code that interacts
with webpages in an automated fashion -- perhaps to extract some data from webpages
that isn't available in a more machine-friendly format. This _scraping_ of
webpages is a valuable (if sometimes maliciously applied) skill that can be
useful to many kinds of software engineers and data scientists. This exercise
talks you through some applications of one of the most common frameworks, a
Python library called BeautifulSoup.

## Setup

First, you want to install the BeautifulSoup library, which you can achieve
system-wide with `sudo apt install python3-bs4`. Python does have its own 
package manager, `pip`, which you could use to install `bs4` in a virtual 
environment instead.

You can test that Python is working by just typing `python3` at the command line
-- it should launch the interactive interpreter, which will prompt you for
Python code with `>>>`. Type `from bs4 import BeautifulSoup`. If this completes
then you've successfully imported the library. 

## Interacting with Soup

Next, enter something like the following:

```python
file = "cattax/index.html"
soup = BeautifulSoup(open(file, 'r'))
```

_(You may need to change the 'file' line to reflect where the `cattax/index.html`
file really is relative to where you launched `python3`. Also, if you close the
interpreter at any point remember you'll need to re-run the `import` line above
to get the library)._

You now have a 'soup' object, which is a Python object that has various methods
for interacting with HTML (and XML) documents and accessing their contents. To
start with, just type `soup` in your interpreter. Python will print out the
basic textual representation of the object, which is just the source of the
`index.html` page. Next, let's attempt one of the commonest use-cases for scraping. 

```python
soup.get_text()
```

You should see a string containing the textual content of the webpage. If you
call `print` on the result, you should see that the text has been laid out in a
fair approximation of how the visible text would appear on a webpage.

```python
text = soup.get_text()
print(text)
```

Getting the visible text out of a page is a common requirement if, e.g., you
were going to use the webpage as input to an NLP system. You can also access
non-visible portions of the page -- `soup.title` will give you the title element
of the webpage, and `soup.title.text` will get you the textual content within
the title element. Note the difference: `soup.title` is a BeautifulSoup element
(of type `Tag`), and has methods associated with being a tag; `soup.title.text`
is just a string, and only has methods that apply to strings.

As HTML documents are structured, you can interact with them in a structured
manner. `soup.head` will get you a soup object reflecting the 'head' part of
the HTML structure, and `soup.head.findChildren()` will return a list containing
all of the 'children' elements inside the head. By knowing the structure of the
document you can thus navigate to certain elements programmatically. This
doesn't just relate to the tags, either: you can also access the value of
attributes. `soup.head.meta['charset']` would access the `charset` attribute of
the meta tag in the head of the document. 

### Exercises

1. Take a look at some other examples from [the BeautifulSoup documentation](https://beautiful-soup-4.readthedocs.io/en/latest/#navigating-the-tree), in particular regarding the use of the `.find_all()` method. 
2. Use your interpreter to access a list of all the `<strong>` elements in the
   webpage, and figure out how to print out just the text contained within them.
3. How would you use `.find_all()` to find all `<div>` elements with a
   particular class value (e.g., 'container')? Would your method work if the div
had multiple classes?


## A Scraping Script

Download [this python script](./scrape.py) to the directory that
contains your `cattax` folder (_not_ into `cattax` itself). On the command line,
you should be able to run this script with `python3 scrape.py`. You'll see that
it prints out a series of lines related to all the files in `cattax`. 

Open `scrape.py` in an editor and inspect what it is doing. The script imports
two libraries, one is BeautifulSoup and the other is `os`, which allows the
script to use certain operating system functions. `os.listdir` is then used to list the
contents of our `cattax` directory and iterate over them. We filter the
filenames by checking to see which of them end with the string 'html', and if
they do then we open the file and parse it into a BeautifulSoup object. Then, we
print out text from certain elements, separated by a ':'. Understand how this
works, asking a TA or lecturer for help if you aren't sure.

### Exercises

1. Modify `scrape.py` so that it _also_ prints out the contents of the 'info'
   paragrah in each page (this can be a second print statement). Run the script
again to test that it works.
2. Currently the script prints something for _every_ page. Modify it so it would
   only print something out for the leaf nodes -- those pages that don't have a
'container' element of their own.
3. Printing things out can be useful, but often we want to store values we
   scrape for later programmatic work. Rather than printing out information,
create and update a [Python dict](https://realpython.com/python-dicts/) for all
leaf nodes where the dictionary keys are the titles of a page and the values are 
the corresponding content of the 'info' box. _Run your script with `python3 -i
scrape.py` and it will execute your script and then place you in an interactive
session immediately following your script's execution. You can then check that
the dictionary's contents are what you expect by interacting with the dict
object in your interpreter._



## When to scrape

As we discuss in this week's lectures, scraping webpages can come with some
risks, depending upon how you go about it and what you do with the results.
Guidelines you should follow include:

+ Always respect the [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt) presented by a site. Resources denied to crawlers may be protected for a legal or ethical reason. 
+ Always look for an API first. If a site will provide you with a JSON endpoint
  to query for the structured data you want, it is both easier and more polite
to use that API instead of scraping the same data from webpages designed for
human consumption.
+ Be very careful about any scraping behind an authenticated log-in, such as
  from a logged-in social media account. Think about the privacy expectations
people have about the content you are collecting, both in legal and ethical
terms. If you post publicly something that was intended only for a limited
audience, you could be betraying a confidence, and might even face legal
repercussions.
+ Generally beware that being able to access and read information from the web
  does not mean you are permitted to republish it, even in a modified form.


## Further reading

You may have noticed that we downloaded our webpages with `wget` in the previous
exercise, and then dealt with their content using Python in this one. If you
were writing a Python tool that was meant to do something specific with the
content of a webpage, then you would often want to avoid using a second tool,
and make web requests directly from your program.
The Python library that is most often recommended for requesting web resources
is the [Requests library](https://docs.python-requests.org/en/latest/), and
getting familiar with it would be useful both if you wanted to access web pages
programmatically and if you need to interact with a website's API.

We've also been dealing with the content of _static_ websites, without the dynamic
content like that you learned about in the Javascript exercises. Scraping
dynamic sites gets trickier, as your scraper needs to have a browser-like
context to execute Javascript within, and often might need to pretend to
interact with the page. Systems like [Selenium](https://www.selenium.dev/documentation/) 
are designed for cases like this.

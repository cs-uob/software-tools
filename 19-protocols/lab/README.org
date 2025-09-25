#+title: RFC 1288: The Finger User Information Protocol

This week we're going to be implementing the Finger protocol.  To do this you're going to need to implement a /server/ and a /client/ for the protocol: the /client/ is easier so start with that.  You can use whatever programming language you like---but bare in mind we can *only* help you debug the programming languages we know.

First things first: you need to understand the protocol.

*Exercise:* Read IETF RFC 1288: [[https://datatracker.ietf.org/doc/html/rfc1288]] 

It's only 12 pages, but pay special attention to Section 2 (where the protocol is documented) and Section 4 (where there are example sessions).  Make notes.

* Part 1. Client

*Exercise:* Implement a Finger client.

You'll need to look up how you make network requests in your favorite language.
- If you want to do it in C or assembly[fn:1] have a read over [[https://beej.us/guide/bgnet/][Beej's Guide]] (and maybe if not too)
- If you like Python: [[https://docs.python.org/3/howto/sockets.html]]
- If you like Java: [[https://docs.oracle.com/javase/tutorial/networking/sockets/index.html]]
- Array-oriented tacit stack programming more your thing?[fn:2]  Uiua has a socket API: [[https://www.uiua.org/docs]]

You'll need a server to test against though.  Start with =netcat= listening on a port and check the messages are getting through as you'd expect then try fingering someone else's server.

- You can get weather forcasts by fingering =bristol@graph.no= (and try fingering =@graph.no= for more options).
- [[https://plan.cat]] is a public finger server... have a look at what people post

  *Hint:* the simplest possible implementation would be this shellscript:

  #+begin_src sh
    nc "${1:?URL}" <<<"${2:?Who}"
  #+end_src

 But that's probably cheating and you'll learn nothing.

* Part 2. Server

*Exercise:* Implement a Finger server.

If you want to do it on the lab machine you'll have to use a non-standard port.  You *might* want to test it on a lab machine, but you'll need to set up port forwarding.  See the HTTP labs vagrant configuration.

How do you read user's =.plan= files?

* Footnotes
[fn:1] Because you enjoyed the debugging lab a lot and want to make the TAs hate you. 

[fn:2] We love, fear, and respect you people...

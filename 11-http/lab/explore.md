# Exploring HTTP

This week we will be having you run various kinds of _server_ and interact with
those servers as a _client_. You'll be juggling both roles in the client-server
relationship, and it's important to bear in mind that the software you're
controlling usually works for different parties, usually on separate machines
communicating over a network.

## Port forwarding on Vagrant

If you want to run a server inside a Vagrant VM and connect to it with a browser running directly on the host machine (outside the VM), then you will need to tell Vagrant which ports within the VM to make available outside the VM. Open your Vagrantfile and add the line

    config.vm.network "forwarded_port", guest: 8000, host: 8000

in the main block (just before the `config.vm.provision` line will do), then restart your VM if it is already running. This tells Vagrant to open a server on port 8000 on the host (the lab machine), and forward any traffic it receives to port 8000 on the VM.

You can now start the VM, run a server inside the VM, and connect to it from the browser on the lab machine.


## Before you start

To avoid an annoying problem, before we run our own server we are going to check that no-one else is already using the TCP port we want.

On the machine where you intend to run the _server_, run the command 

```
wget localhost:8000
```

It should time out after a couple of seconds (or instantly) with "failed" and
some error message. This is the expected result, and if the above command fails
then you can proceed on to the section 'A basic HTTP server and client' without
having to do anything else.

If however it succeeds (shows "Connected" or "200 OK" anywhere), then someone or
something else is using port 8000, and you need to figure out what that is and
work around it. 

First, run

    netstat -tan
    
and check that there is no line with the value "8000" under Local Address and a state of LISTEN or ESTABLISHED. If you get a lot of lines, `netstat -tan | grep 8000` will help. It does not matter if 8000 appears in the Foreign Address column, but there must be no-one using port 8000 under Local Address.

If either `wget` or `netstat` suggests port 8000 is in use,

  - If you are on a lab machine, it could be that another student is using port 8000 (maybe they are logged in via SSH).
  - You might have other software (such as a web development package) already using that port.

If you can't free up port 8000 by stopping other software, you can try the tests
above with port numbers 8001, 8002, etc. until you get one that is definitely
not being used and then replace 8000 with that in all further exercises today.

Note: if you have Vagrant running and configured as described in the section
above, and you run `wget localhost:8000` on the host machine (not the VM), then
Vagrant will be using port 8000 and `wget` might block waiting for a reply. This
is the correct behaviour, and this is why I asked you to run `wget` on the
machine where you want to run your _server_, not the _client_. If you want to do
the following exercises with both server and client on the host machine, then
you would need to stop the Vagrant VM first or remove the 8000 line from your
Vagrantfile.


## A basic HTTP server and client

Open a terminal on the machine where you want to run the server, and download
the file [http-response](./http-response) to the folder where your terminal is
open (for example with `wget`). Then run the (non-terminating) command

```
nc -l -p 8000 < http-response
```

This calls the tool `nc` ("network cat") and tells it to listen on TCP port 8000
(`-l -p 8000`), to run a server there. (If you are using a Mac, you may need to
use `-l 8000` instead, as the Mac version of `nc` has slightly different
options).

When a client connects, `nc` will by default read from its standard input and
write this to the client, so we use a shell redirect to make it read from a file
instead. Note that _until_ a client connects, `nc` will 'block' (that is, do
nothing). The file contains some standard HTTP:

    HTTP/1.1 200 OK
    Content-type: text/plain
    Content-length: 18
    Connection: close

    Hello over HTTP!


(If you want to type this out yourself or copy-paste, you **must** save the file with CRLF line endings and put two newlines after the hello message.)

`nc` will block until you connect a client. Open another terminal on the machine you want to run your client and run

    wget -q -S -O - localhost:8000

You have now made a HTTP connection from the `wget` client to the `nc` server.
The server terminal should print out the HTTP request it got from the client
(this is built into wget) and the client should print out the response from the
server (which comes from the file).

## Connecting with a web browser

Note that `nc` makes for a _terrible_ server -- it will only serve one client,
and then it considers its job done and shuts down (this is because `nc` is just
a networking tool we're temporarily using as a primitive server). Run `nc -l -p
8000 < http-response` again on your server machine.

Open a web browser on your client machine. If you're using Chrome/Edge or
Firefox, open the debug tools (`F12`) and go to the Network tab before you open
the page.

Navigate to `localhost:8000`. You should see the line "Hello over HTTP!" and `nc` will print the HTTP request from your browser. You can then close it with `Control+C` if it doesn't terminate by itself. In your browser's debug tools, on the network tab you should see a file `localhost`, click this and then select _Headers_ in the details that appear.

This details page shows you the HTTP request details, including the response code (`200 OK` in this case) and all the headers sent in both directions. This screen is one of the first places you should look at when something web-based that you've coded is not working correctly or at all, as HTTP is normally the lowest layer you need to care about.

In particular, the `Content-type` header is a common source of mistakes: if you want to serve e.g. a script or a stylesheet but you don't set the correct type header, your browser may download the file just fine but won't do anything with it. Similarly, whether you send `text/plain` or `text/html` determines whether the browser will interpret a file you navigate to as HTML or not.

## A web server in C

On your server machine, clone the repository `https://github.com/emikulic/darkhttpd` which contains a single-file web server in just under 3000 lines of C. You do not need to understand this code, and in 2nd year Computer Systems A you will be able to write a web server in around 10 lines of golang instead and understand the concurrency principles behind it.

Compile the program either with `make` or simply `gcc darkhttpd.c -o darkhttpd`. Its job is to serve files within a folder, so make a subfolder called `web` and then run it with `./darkhttpd web --port 8000`. You can stop it again at the end of the exercise with `Control+C`.

You can now experiment with the following:

  - Create some files (plain text, HTML, image etc.) in `web/`.
  - Access them from your browser with `localhost:8000/FILENAME`, for example `web/hello.txt` would become `localhost:8000/hello.txt`.
  - Observe the HTTP headers in your browser's developer tools, and the server logs printed in the server terminal.

This particular server is written so that if you try and access a folder instead of a file, for example just `localhost:8000` which has the implicit path `/` which maps to the `web` folder, then it shows a list of files in this folder as clickable links.

Pay particular attention to how the `Content-type` header is sent depending on the file extension. From the browser's point of view, that header is what counts: if you send a file with `.html` extension but set `Content-type: text/plain`, the browser would not interpret it as HTML. This makes it possible to serve URLs with no "extension" at all like `/students` for a database application, and still have the browser understand what to do.

From the server's point of view, this server (like most other servers that simply serve files from a folder) has chosen to use a file's extension to determine what `Content-type` to send; this is implemented in the `default_extension_map` starting at line 320 of the source file.

You can try this out for yourself if you want: make a HTML file called `one.html5` in the web directory and access it with the browser. (`.html5` is not an official extension, it's something I just made up. The correct one to use for proper websites is `.html`.) The server won't send a `Content-type` header at all, since it doesn't know this extension, so the browser will either display it as a plain text file or download the file instead of showing it.

Edit the map in the source file and change the entry for `text/html` to read `" html htm html5"`, keeping the space at the start of the string. Recompile the server.

Rename the file to `two.html5` (I'll explain why in a second) and restart the server and try and open the file in the browser. This time, the file will display as a HTML page.

Why did you have to rename the file? Because the browser will otherwise try and be clever if it thinks you're trying to access a file that you've just downloaded already. The server sends a `Last-modified` header, and if the browser notices you're asking for a file you have just downloaded, with the same timestamp as the HTTP header indicates, then your browser might ignore the rest of the request and not see that another header has changed. Changing the file name forces the browser to look again, as it thinks it's a different file now. Deleting the downloaded file, or editing the file on the server, would both have the same effect.

There is a moral here: if you're doing web development, and you are trying to find out why a change you made isn't showing in the browser (even if you refresh the page), it might be a cache problem. On the network tab of the developer tools window, there should be a checkbox to "disable cache" which you might want to turn on in this case and reload the page again, to exclude the cache as the possible source of the problem.

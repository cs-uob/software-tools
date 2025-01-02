# Software Tools
(COMS10012 / COMSM0085)


## TB2 Lineup:
 1. Web protocols (HTTP)
 2. Web documents (HTML)
 3. Visual style (CSS)
 4. Design with CSS 
 5. Dynamic content (Javascript) 
 6. Asynchronous Javscript
 7. _Reading Week_
 8. Web scraping (`wget`, BeautifulSoup)
 9. Library management
10. Other internet protocols
11. Practical encryption (`gpg`, OpenSSL, LetsEncrypt)

---

## Week 1: HTTP
(or, "How to Serve the Web")
 - The point of protocols.
 - HTTP message structure.
 - Targets, methods, and status codes.
 - Why `nc` isn't doing anything.

---

## But First...

A review of TB1 examination results.

---
## HTTP

HyperText Transfer Protocol

Immediate questions: 
 - What is 'hypertext'?
 - What is a 'transfer protocol'?

---
## HTTP: The Protocol

Developed by Tim Berners-Lee at CERN, 1989.

Published as a set of _RFC_ specifications.

Your exercise this week includes reading parts of RFC 7230!

---
## Protocols

A protocol is a plan for how cooperating components of a system should interact.

Simple example:

**Client:** Give me block #200

**Server:** Here you go: _0A 2F EE ..._
---
## Protocols: Status Communications

Responses are not just the data requested. For example:

**Client:** Give me block #45000

**Server:** Sorry, I couldn't find that block.

or

**Client:** Gimme block #200

**Server:** Sorry, I don't know what you're asking.

or 

**Client:** Give me block #200

**Server:** I think you meant block #201, which is _0A 2F EE ..._

---

## What you're standing on

Inherent to everything we're attempting is the idea that we can 'simply' address
a message to a recipient and have it arrive there.

HTTP is an application-layer protocol, which operates at the _top_ of a stack of
network protocols and technologies which work to achieve that aim. 

### The OSI model

- 7: Application (you are here)
- 6: Presentation (e.g., TLS)
- 5: Session (e.g., SOCKS)
- 4: Transport (e.g., TCP, UDP)
- 3: Network (e.g., IP)
- 2: Data Link (e.g., MAC)
- 1: Physical (e.g., Bluetooth, Ethernet PHY)

We aren't covering the protocols at the other layers in any depth, but you should be aware that they are there.

---


## HTTP Status Communications

HTTP transfers hypertext (of course). This is the _data_ the protocol is
concerned with. Like the previous toy example, HTTP is also a client-server
protocol with request-response semantics.

But HTTP also transfers _metadata_ about the status of communicating parties.
There are two key mechanisms for this:
 - request and response _headers_
 - status codes

Important to understand: the metadata is an important part of the HTTP
_protocol_. However, _metadata_ is separate from the _data_. A hypertext
document does not _have to_ arrive via HTTP.

---

## HTTP message structure

From the RFC:

```
HTTP-message   = start-line
                 *( header-field CRLF )
                 CRLF
                 [ message-body ]

```

A `start-line` can be a `request-line` (for a request) or a `status-line` (for a
response).

Headers are optional, and internally are `field-name : field-value`.

---

## HTTP Requests

Per RFC 7230, the format for a HTTP request-line is:

`method SP request-target SP HTTP-version CRLF`

+ `SP` = space 
+ `CRLF` = carriage return

The `HTTP-version` rarely changes (though it can!). 

Key elements to understand are `method` and `request-target`.


---

## HTTP Methods 

 + `GET`   : retrieve a copy of the target resource
 + `POST`  : submit payload data to a target resource
 + `HEAD`  : retrieve metadata for corresponding GET
 + `PUT`   : replace target resource with payload
 + `DELETE`: delete the target resource

In practice, many servers do not implement or will ignore `DELETE` or `PUT`
requests in favour of custom semantics using `POST` requests.


---

## HTTP request-target

Simply, the resource you are targeting with your request.

Relates to the `path` and `query` components of a URI (Uniform Resource
Identifier).

- `path`: e.g., `/`, or `/files/index.html` or `/user/george/`
- `query`: e.g., `?name=welcome&action=view` 
  - formed of a series of _parameters_ (`name`,`action`) with values (`welcome`,`view`)

The same resource at a `path` might respond differently to different `query` strings.

---

## HTTP Status Line

Now for the _response_. The format of a status line is:

`     status-line = HTTP-version SP status-code SP reason-phrase CRLF `

 + `HTTP-version` we covered this already in the request
 + `status code` 3-digit code with specific meaning
 + `reason-phrase` description to explain status code

---

## HTTP Status Codes

Can have very specific meanings, but are grouped by first digit with semantic
meaning:

- `1xx` information (e.g., `100 Continue`).
- `2xx` success (e.g., `200 OK`)
- `3xx` redirect (e.g., `301 Moved Permanently`)
- `4xx` client error (e.g., `403 Forbidden`)
- `5xx` server error (e.g., `500 Internal Server Error`)

---

## Example HTTP Exchange

### Request
```http
GET /index.html HTTP/1.1 
Host: www.bristol.ac.uk
Connection: close
```

### Response

```html
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1009


<!DOCTYPE html>
<html lang="en">
...
```

---

## Content-Type

An important _header_ in the response is the `Content-Type`.

This is still _metadata_. Tells the client _what type of data_ the response body
will contain. 

Very important for _browsers_, as clients that interpret response bodies for
humans.

If we changed `Content-Type` of our response from `text/html` to `text/plain`, what would happen?

---

## Workbook 1 Preview: nc

As part of exploring HTTP in the lab this week, we provide a file
`http-response` and get you to run the command:

`nc -l -p 8000 < http-response`

What is this doing?

---

## The End

We'll see you on Friday.

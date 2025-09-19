# Software Tools
(COMS10012 / COMSM0085)

Lecturers: 
 - [Joseph Hallett](mailto:joseph.hallett@bristol.ac.uk)
 - [Matthew Edwards](mailto:matthew.john.edwards@bristol.ac.uk)

Unit Director:
 - COMS10012: Joseph
 - COMSM0085: Matthew

---
## Unit Structure

- 1 **workbook** every week, with guidance & video introductions
    + All on unit website <https://github.com/cs-uob/software-tools/>
- 1 intro lecture   (Tuesday @ 11:00 in Priory Road LT)
- 1 2-hour lab session (Friday in MVB 2.11)

---
### TB1:
 1. System administration (`ssh`,`vagrant`,`apt`)
 2. POSIX fundamentals (`sh`,`chmod`, `sudo`) 
 3. Regular expressions (`grep`, `sed`)
 4. Version control (`git`) 
 5. [continued]
 6. _Reading Week_
 7. Build tools (`make`,`pip`, `maven`)
 8. Debugging (`gdb`,`strace`,`ltrace`)
 9. Databases (`sqlite`, SQL) 
 10. [continued]
 11. [continued]
 12. _TB1 assessment_

---

### TB2:
 1. Web protocols (HTTP)
 2. Web documents (HTML)
 3. Visual style (CSS)
 4. Design with CSS 
 5. Dynamic content (Javascript) 
 6. Asynchronous Javscript
 7. _Reading Week_
 8. Web scraping (`wget`, BeautifulSoup)
 9. PGP
10. Other internet protocols
11. Certificates


---

## Assessment

Two tests, weighted 50% each, both are:

 - 1 hour long
 - multiple-choice exams 
 - open-book (you can bring notes on paper to the exam)
 - on all the topics covered in the respective TB.

---

## Expectations

- Approach workbooks with the intent to learn.
  - Blindly copying-and-pasting from the workbook often won't work.
  - You will be assessed in part on your ability to apply tools to new problems.

+ You are expected to start the workbooks _before_ the Friday lab.
  + Doing pre-reading for the first time in the lab is a poor use of contact time!
  + There is often too much content to easily finish within the lab session.
  + Make the best use of the TAs and lecturers -- get stuck _before_ you go to the lab, and there'll be more time to help you.

- Don't be afraid to ask.
  - Use the Teams channel to raise problems or queries. Other people benefit!
  - Sometimes we make mistakes -- if you point it out we can act on it.

- Attend the labs.

---

# Week 1: System Administration 

We will be covering:

### Workbook 1: System Administration
(or, "A Sysadmin's Illustrated Primer")
- Using `ssh` to access the lab machines remotely.
- Setting up key-based SSH login (in the workbook).
- Vagrant, your Debian setup, and why we're using it.
- Installing packages on Debian.

---

## Workbook 1 Preview: SSH

Goal: log in to the lab machines remotely (so we can do exercises from our beds)

Secure Shell -- tool for secure remote shell sessions. 

Requires the machine we want to log in to (the host) to already be running `sshd` -- the 'daemon' that handles
SSH connections.

`ssh user@host`

Problem: I can't remember a specific lab machine's address.

`ssh user@rd-mvb-linuxlab.bristol.ac.uk`

A load-balancer randomly assigns us to a lab machine!

`user@host:~$`

---

## Workbook 1 Preview: Vagrant

Some of the things you will do in this unit require admin rights.

But we don't want to give you admin rights to the lab machines.

Solution: Virtual machines managed by a container system (`vagrant`).

You can freely reconfigure, install software, destroy the OS, etc.

Write a `Vagrantfile` which specifies the configuration.

`vagrant up` to launch the VM.

`vagrant ssh` to log in to the VM.

`vagrant halt` to shut down the VM.

On the lab machines: VM storage isn't persistent.

---

## Workbook 1 Preview: apt

On your Vagrant images you can install software -- but how?

Can build from source, but typically you use a _package manager_. 

`sudo apt-get install <package>`

How do you know which package to install?

`apt-cache search <term>`

You can (and for lab machines may need to) add software installation to your Vagrantfile.

---
## The End

We'll see you on Friday.

# Lab 01: Welcome to the Labs


## Secure shell

Secure shell (SSH) is a protocol to allow you to remotely log in to another computer, such as a lab machine. Almost everyone who uses SSH uses the free OpenSSH implementation, which is standard on pretty much every Linux distribution and is also available for Windows and Mac - and even for the mobile operating systems iOS and Android.

We will see in more detail how SSH manages connections later on, but for now imagine that it opens a network connection between your own machine, and a shell running on a different machine. When you type something, SSH encrypts this and sends it to the other machine which decrypts it and passes it to the shell (or any other program you're running); when the shell replies then SSH encrypts that and sends it back to you. For this to work, (Open)SSH is actually two programs:

  * `ssh` is the client, which you run on your machine to connect to another machine.

  * `sshd` is the server, or _daemon_ in UNIX-speak. It runs in the background on the machine you want to connect to, and needs to be installed by the system administrator. Note: SSH uses TCP port 22 by default.

> **Note:** Whilst being able to ssh into the labs and work on your own computer is nice, it isn't essential.  If things go wrong, we may just tell you to use the computer you're sitting in front of: it tends to be more reliable.

### Check your client

First of all, let's check that the ssh client is working.

  * Open a terminal on your own machine: Linux, Mac OS or Windows Subsystem for Linux should be fine. Windows 10 CMD might work too if you have the Windows version of OpenSSH installed (for example if you have git installed which uses ssh behind the scenes).

  * Type `ssh localhost` and press ENTER. Several different things could happen:

    - If it asks for a password, then the ssh client is working, and a ssh server is running on your current machine. The password would be your user account password, but we don't actually want to log in again so cancel with Control+C.

    - If it succeeds without a password, then the client is working and a ssh server is running on your machine and either you do not have a password, or you already have a key set up. Type `exit` and press ENTER to get back to your previous shell.

    - If it shows "connection refused", then you have the ssh client correctly working but no server running on your own machine. This is not a problem, as we're trying to log in to the lab machines, so we need a client on our machine and a server on the lab machine.

    - If it shows an error that ssh is not found, then you don't have (Open)SSH installed which is very unusual except on windows CMD - in which case please switch to using the windows subsystem for linux.

### Connect to the lab

The lab machines have names `it######.wks.bris.ac.uk` where the hashes represent a number from 075637 up to 075912. However, not all of them will be working at any one time, and if everyone connects to the same machine then it will quickly get overloaded, Instead, we will use the load balancer `rd-mvb-linuxlab.bristol.ac.uk`. This connects you to a lab machine that is currently running and ensures that if everyone uses this method to connect, then they will be more or less equally distributed among the running machines.

To access the load balancer you will need to be connected to a university network, either by directly accessing eduroam or by following the [university's guide to using the VPN](https://uob.sharepoint.com/sites/itservices/SitePages/vpn.aspx) for remote access.

Try the following:

  * On your terminal, type `ssh USERNAME@rd-mvb-linuxlab.bristol.ac.uk` where you replace USERNAME with your university username, e.g. `aa20123`. Obviously, you will need a working internet connection for this.

  * If it asks you whether you are sure, type `yes` and press ENTER. SSH will only do this the first time you connect to a machine that you have never used before.

  * When prompted, enter your university password and press ENTER.

  * You should now be connected to a lab machine, with a prompt of the form `USERNAME@it######:~$`. 

  * Try `whoami` and `uname -a` to check who you are logged in as, and where; also try `hostname` which just prints the machine name.

  * Type `exit` to get back to your own machine. 

Note that while you _can_ access the load balancer when you are sitting at a lab machine, there is no purpose to doing so, as it simply logs you into another (randomly-selected) lab machine.

### Setting up ssh keys

When you connect to a machine, the client on your computer and the daemon on the machine you're logging in to run a cryptographic protocol to exchange keys and set up a shared secret key for the session, so that what one side encrypts the other side can decrypt again. It also authenticates you to the server using one of several methods. 

You might have heard from a security source that there are three main authentication factors: something you know (password or PIN), something you have (physical key, digital key, ID card, passport) and something you are (biometrics). An authentication method that requires two of these is called two-factor authentication and this is considered good security practice. For ssh, this means:

  * You can log in with a username and password, that is "something you know". This is the default, but not the most secure.

  * You can log in with a (digital) key, that is "something you have". This is more secure, as long as your key (which is just a file) doesn't get into the wrong hands, and also the most convenient, as you can log into a lab machine or copy files without having to type your password.

  * You can log in with a key file that is itself protected with a password. This gets you two-factor authentication.

The keys that SSH uses implement digital signatures. Each key comes as a pair of files:

  * A private key (also known as secret key) in a file normally named `id_CIPHER` where CIPHER is the cipher in use. You need to keep this secure and only store it in places that only you have access to.

  * A public key in a file normally named `id_CIPHER.pub`. You can share this with the world, and you will need to store a copy of it on any machine or with any service that you want to log in to (for the lab, because the lab machines all share a file system, you only need to store it once).

Let's create a key pair:

  * **On your own machine**, type the command `ssh-keygen -t ed25519`. (If you get an "unknown key type" error, then you are using an outdated version of OpenSSH and for security reasons you should upgrade immediately.) _Note: type `ed25519` directly, do not replace this with your username. It stands for the "Edwards curve over the prime `2^255-19`" cryptographic group, if you want to know._

  * When it asks you where to save the file, just press ENTER to accept the default, but make a note of the path - normally it's a folder `.ssh` in your home directory.

  * If it asks you "Overwrite (y/n)", say no (n, then ENTER) as it means you already have a key for something else - either ssh directly or something that uses it, like github. Restart key generation but pick a different file name.

  * When it asks you for a password, we recommend that you just press ENTER which doesn't set a password (good security, maximum convenience). If you do set a password, it will ask you to type it twice and then you will need the password and the key file to use this key (maximum security, less convenient).

The `-t` parameter selects the cryptographic algorithm to use, in this case `ed25519`, which is modern, peer-reviewed, and generally considered one of the most secure public-key algorithms available. However some older ssh versions don't accept ed25519. If you ever need to use SSH keys to a machine that doesn't like ed25519, then use the key type "rsa" instead. We would recommend you avoid the alternatives "dsa" and "ecdsa" if at all possible as there is speculation among cryptographers that there may be a flaw in the design.

Have a look at the folder where your keys are stored. `ls -l ~/.ssh` will do this, unless you chose somewhere else to store them when you created them:

```

-rw-------. 1 vagrant vagrant  411 Oct  7 10:50 id_ed25519

-rw-r--r--. 1 vagrant vagrant   98 Oct  7 10:50 id_ed25519.pub

-rw-r--r--. 1 vagrant vagrant 1597 Oct  7 11:54 known_hosts

```

Note the permissions on these files in my example. The private key (first line) has a permissions line at the start of `(-)(rw-)(---)(---)` where I've added brackets to make clearer what is going on. The first bracket only applies to special file types (e.g. `d` for directory). Next, the owner permissions which are in this case read and write (the third one would be `x` if the file were an executable program). The last two brackets are the permissions for the group and for everyone else, and these are all off so no-one except yourself (and root) can read your key file. OpenSSH is picky about this and will refuse to use a private key that other people have access to.

The public key permissions are `(-)(rw-)(r--)(r--)` which means that the owner can read and write, and the group and everyone else (assuming they have access to the folder) can read the public key, which is fine. It's a public key after all.

`known_hosts` is where SSH stores the public keys of computers you've already connected to: every time you answer yes to an "Are you sure you want to connect?" question when you connect to a new computer for the first time, it stores the result in this file and won't ask you again the next time. The file format is one key per line and you can edit the file yourself if you want to.

### Set up key access on the lab machine

First, you need to upload your public key to the `~/.ssh` directory on your lab machine home folder. Even before this, we need to make sure the directory exists though:

  - Log in to a lab machine with `ssh` and your password.

  - Try `ls -al ~/.ssh`. If it complains the folder doesn't exist, create it with `mkdir ~/.ssh`.

  - Log out again with `exit`.

The command for copying a file is `scp` for secure copy, which works like `cp` but allows you to include remote hosts and does the copy over SSH. Run this from your own machine:

```

scp ~/.ssh/id_ed25519.pub USERNAME@rd-mvb-linuxlab.bristol.ac.uk:~/.ssh/

```

Obviously, replace USERNAME with your university username. This will ask for your password again. Note that to set up access, we are uploading the public key - not the private key!  The point of key-based authentication is that your private key never leaves your own machine, so even university administrators never get to see it, which would not be guaranteed if you stored a copy on a university machine.

Logging in to a machine does not send the key to that machine. Instead, the machine sends you a challenge - a long random number - and SSH digitally signs that with the private key on your own machine, and sends the signature back which the remote machine can verify with the public key. Seeing a signature like this does not let the machine create further signatures on your behalf, and it definitely does not reveal the key.

This way, you can create one SSH key and use it for university, github and anything else that you access over SSH, and even if one service is breached then this does not give the attacker access to your accounts on the other services.

The general syntax of scp is `scp source destination` and source or destination  may be of the form `[USERNAME@]HOSTNAME:PATH` - if it contains a colon (`:`), then it refers to a file on a different machine.

Now log in over ssh and type your password one last time. Then run the following:

```

cd .ssh

cat id_ed25519.pub >> authorized_keys

chmod 600 authorized_keys

```

SSH will accept a public key if it is listed in the file `authorized_keys` in the user's `.ssh` folder, the format is one line per key. Instead of just copying `id_ed25519.pub` to `authorized_keys`, which would overwrite the latter file if it already existed, we use the construction `cat SOURCE >> DEST` to have our shell append the source file to the destination. _Note: it's **authorized**, the American spelling -- if you use the British spelling here OpenSSH won't know to read that file._

However, if the authorised keys file didn't exist already, then it has now been created with default permissions and SSH won't accept that for security reasons. `chmod` means change permissions (also known as "mod bits") and 600 is the bit pattern we want in base 8, because that is how permissions work for historical reasons. Permissions are a bitfield of 9 bits, the first three are read/write/execute for the owner, the next three the same for the group, and then for everyone else. If you `ls -l` you will see this in a slightly more human-readable format, namely `rw-------` where a minus means that a bit is turned off.

Now type `exit` to get back to your own machine, and then `ssh USERNAME@rd-mvb-linuxlab.bristol.ac.uk` to log back in. It should log you in without asking for a password, and you have now set up key-based SSH authentication. Note that even though you can log into different lab machines each time you access the load balancer, your home directory is the same across all lab machines, so you don't need to install the key on each one separately. 

_Note: if you set a password on your SSH key earlier, then it will ask you for a password, and it will expect the key password not your uni password. You know not to ever reuse your university password for anything else, right?_

If for some reason something doesn't work with ssh, the first thing to try is to add the `-v` switch enable debugging information (you can even do `-vv` or `-vvv` to see even more detail, but we don't need that). If there is a problem with the permissions on your private key file for example, then you will see SSH complain in the debugging information.

From now on, from you own machine, you should be able to get directly into a lab machine with the following command, which should not ask for your password at all:

```

ssh USERNAME@rd-mvb-linuxlab.bristol.ac.uk

```

### Setting up a configuration file

You now have a login command that works, but you still have to remember the load balancer address, which can be a pain. One way to offload this memory exercise is to store the details in a configuration file.

SSH reads two configuration files: one for all users at `/etc/ssh/ssh_config` (`/etc` is where POSIX programs typically store global settings) and a per-user one at `~/.ssh/config`. The site [https://www.ssh.com/ssh/config/](https://www.ssh.com/ssh/config/) or just `man ssh_config | less` on a terminal contain the documentation (`man` means manual page, and `less` is a program that shows a file on page at a time and lets you scroll and search).

Create a file called simply `config` in your `.ssh` directory on your own machine. You can do this for example with `touch config` (make sure you're in the `.ssh` directory first, `cd ~/.ssh` gets you there), and then editing it in your favourite text editor. Add the following lines, replacing USERNAME with your username:

```

Host lab

  HostName rd-mvb-linuxlab.bristol.ac.uk

  User USERNAME

```

This now lets you use simply `ssh lab` to log in to a lab machine.

### Using different keys

You do not need this for the lab, but if you are ever managing different systems and accounts then you might use a different key file for each one. In this case, ssh on the command line lets you do `-i FILENAME` to select a private key file, and in the configuration file you can select a file for a particular host with the `IdentityFile FILENAME` line. By default, ssh will search for files in `.ssh` with names `id_CIPHER`, as you can see if you launch a connection with the `-vv` parameter which shows detailed debugging information.

## Installing Vagrant and Debian 

[Vagrant](https://www.vagrantup.com/) is a program to manage virtual machines (VMs). Using a configuration file called a `Vagrantfile`, it can download and configure disk images, which it calles boxes, and call other programs to run them. Vagrant does not run the VM by itself, so you will need another program like [virtualbox](https://www.virtualbox.org/) for that.

### Installing on your own machine

To use vagrant on your own machine (recommended), follow these steps:

  * Go to [https://www.vagrantup.com/downloads](https://www.vagrantup.com/downloads) and download the version of vagrant for your operating system. Windows, Mac OS and common versions of Linux are supported.

  * Download and install Virtualbox from [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads).

  * Reboot your machine.

If you are on Linux, you can of course also install the programs from your distribution's repository. Vagrant's developers actually recommend against this because they claim that some distributions package outdated versions, but it is your choice.

### Configuring a box

Next, you are going to configure a virtual machine using [Debian linux](https://www.debian.org/), a Linux distribution that we will be using in this unit. 

  * Create an empty folder somewhere.

  * In that folder, create a file called Vagrantfile (capitalised, and with no extension) and add the following lines to it - or just download the file from [here](./Vagrantfile):

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "generic/debian12"
  config.vm.synced_folder ".", "/shared"
  config.vm.provision "shell", inline: <<-SHELL
    echo "Post-provision installs go here"
  SHELL
end
```

This configuration file is actually a script in the Ruby programming language, but you don't need to learn that to use Vagrant. Let's look at what it does.

  * `config.vm.box` selects the virtual machine image, or box in vagrant-speak, to use. You can see a list of available ones at <https://app.vagrantup.com/boxes/search>.

  * `config.vm.synced_folder` sets up a shared folder between the guest (virtual machine) and host (your machine). Files you put in the same folder as 'Vagrantfile' will appear at the path `/shared/` inside the VM, and vice-versa. This is very useful for transferring future exercise materials to and from the VM.

  * The `config.vm.provision` runs a provisioning command when the box is first downloaded and installed. These commands run as root on the virtual machine, and could be used to install software with a package manager (we will talk about this later).

  * The `<<-SHELL` construction is called a "here document", and is a way in some programming languages of writing multi-line strings. It tells ruby to treat everything until the closing keyword SHELL (which is arbitrary) as a string, which can contain several lines.

### Running vagrant

  * Open a terminal in the folder containing the Vagrantfile. If you are on Windows, both the Windows CMD and the Windows Subsystem for Linux terminal will work equally well for this purpose.

  * Run the command `vagrant up`. This starts the virtual machine configured in the current folder, and if it has not been downloaded and provisioned yet (as is the case when you run `up` for the first time) then it does this for you as well.

  * When Vagrant tells you the machine is running, run `vagrant ssh` to log in to your virtual machine. If it asks you for a password, use `vagrant`.

  * You should now see the virtual machine prompt `vagrant@debian12:~$`. Try the command `ls /` and check that there is a folder called 'shared' in the top-level folder, along with system ones with names like `usr` and `bin`.

There are two kinds of errors you might get during `vagrant up`:

  - If vagrant complains that it can't find a provider, then you have probably not installed virtualbox, or not rebooted since installing it.

  - If you get some odd crash or error message about hypervisors, see the page [https://www.vagrantup.com/docs/installation](https://www.vagrantup.com/docs/installation) for instructions, section _Running Multiple Hypervisors_. Basically, you cannot run vagrant when another program is already using your processor's virtualisation subsystem, and the page gives instructions how to turn off the other one.

### Shutting down cleanly

To exit the virtual machine, type `exit` which will get you back to the shell on the host machine. On the host, `vagrant halt` cleanly shuts down the virtual machine.

Promise yourself that you will always do this before turning off your computer, if you have been using Vagrant!

### Running on a lab machine

Vagrant is already installed on the lab machines in MVB 2.11, so you can remotely log in and launch a box from there. This will get you exactly the same Debian environment as when you run it on your own machine, and everyone should try this out too. If for some reason you cannot run Vagrant on your machine, then as long as you have an internet connection you should still be able to run it on the lab machines.

First, we connect to a lab machine: if you're working from your own machine, open a terminal and run the command `ssh lab` that you configured in the previous exercise on SSH. Obviously if you're sitting at a lab machine you don't need to do this.

On the lab machine, we need to create a folder and load a Vagrantfile as above, but let's download the Vagrantfile from the unit webpage instead of typing it out. You can call the top folder ('softwaretools' in the below example) anything you like and put it anywhere you want. Run the following shell commands (the third one starting `wget` must be all on one line, even if your web browser has added a line break):

```sh

mkdir softwaretools
cd softwaretools
wget https://raw.githubusercontent.com/cs-uob/software-tools/main/01-sysadmin/lab/Vagrantfile

```

You can now run `vagrant up` followed by `vagrant ssh` from inside the folder you just created.

Note: When you `vagrant up`, Vagrant internally connects port 22 on the guest (which `sshd` on the guest is listening to) to port 2222 on the host. When you provision a Vagrant machine, this creates a key pair on the host and loads the public key into the guest. The private key is actually in the file `.vagrant/machines/default/virtualbox/private_key` on the host, and the public key in `/home/vagrant/.ssh/authorized_keys` on the guest. So what `vagrant ssh` does is launch `ssh -i KEYFILE vagrant@localhost -p 2222`.

### Warning about lab machines - read carefully!

Your files in your home directory on a lab machine are stored in a network folder, so that you see the same files whichever lab machine you log in to; they are also automatically backed up.

If lots of students created lots of VMs in their home folders, this would take up lots of space, and it would be slow: running an operating system over a network share causes both bandwidth and latency problems.

Instead, IT has configured Vagrant on the lab machines to store VMs in the `/tmp` folder which is local to each machine. This means that:

  * If you log in to a different lab machine, your VMs will be gone.

  * If you log in to the same lab machine but it has restarted since you last logged in, your VMs will be gone.

  * Your VMs, and with them any files you store in the VM itself, are not backed up.

This is not as much a problem as it seems because this is how virtual machines are meant to work: if one is not available, vagrant downloads and provisions it. For this reason, for any software you want installed on your VMs in the lab machines, you should write the install command into the provisioning script in the Vagrantfile so it will be re-installed the next time Vagrant has to set up the VM. We will learn how to do this soon.

However, this still leaves files that you create on the VM itself, such as the ones you will create for the exercises in this unit. The basic warning is that _any files in your home directory will be lost when the VM is rebuilt_. That is why we have set up a shared folder which you can access as `/shared` on the VM, which maps to the folder containing your Vagrantfile on the host machine. Because this is stored under your home folder on the lab machine, it lives on the network file store and so it is backed up and available from all lab machines.

So whenever you log in to a VM on a lab machine to do some work, you should `cd /shared` and use that instead of your home folder for any files that you don't want to lose. If you are running Vagrant on your own computer, then nothing in the VM will be deleted unless you give Vagrant a command to destroy or rebuild the VM yourself.

## Debian system administration

Start your Debian box if necessary by going to the folder with the `Vagrantfile` in your terminal, and typing `vagrant up`. Log in to your Debian box with `vagrant ssh`. We are going to get to know Linux in general and Debian in particular a bit.

### The file system

Linux (and other POSIX-like operating systems) work with a single file hierarchy with a root folder `/`, although there may be different file systems mounted at different places under that. How files are organised in here are documented in the [Filesystem Hierarchy Standard (FHS)](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html). Have a look with the command `ls /`:

`/bin` stands for binaries, that is programs that you can run. Have a look with `ls /bin`: there will be a lot of commands in here, including ls itself. Indeed you can find out where a program is with `which`, so `which ls` will show you `/usr/bin/ls` for example.

`/usr` is a historical accident and a bit of a mess. A short history is on [this stackexchange question](https://askubuntu.com/questions/130186/what-is-the-rationale-for-the-usr-directory) but essentially, in the earliest days,

  * `/bin` was only for binaries needed to start the system - or at least the most important binaries that needed to live on the faster of several disk drives, like your shell.

  * `/usr/bin` was where most binaries lived which were available globally, for example across all machines in an organisation.

  * `/usr/local/bin` was for binaries installed by a local administrator, for example for a department within an organisation.

In any case, `/usr` and its subfolders are for normally read-only data, such as programs and configuration files but not temporary data or log files. It contains subfolders like `/usr/bin` or `/usr/lib` that duplicate folders in the root directory. Debian's way of cleaning this mess up is to make its `/bin` just a link to `/usr/bin` and putting everything in there, but in some distributions there are real differences between the folders.

If you have colours turned on (which is the default) you will see some files are green, but others are blue - this indicates the file type, green is an executable program, blue is a link to another file. Have a look with `ls -l /bin`: the very first character of each line indicates the file type, the main ones being `-` for normal file, `d` for directory and `l` for a so-called _soft link_. You can see where each link links to at the end of this listing. For example, `slogin` links to `ssh`. Other links point at files stored elsewhere in the filesystem -- you'll see a lot of references to `/etc/alternatives/`. 

`/etc` stores system-wide configuration files and typically only root (the administrator account) can change things in here. For example, system-wide SSH configuration lives in `/etc/ssh`.

`/lib` contains dynamic libraries - windows calls these `.dll` files, POSIX uses `.so`. For example, `/lib/x86_64-linux-gnu/libc.so.6` is the C library, which allows C programs to use functions like `printf`. 

`/home` is the folder containing users' home directories, for example the default user vagrant gets `/home/vagrant`. The exception is root, the administrator account, who gets `/root`.

`/sbin` (system binaries) is another collection of programs, typically ones that only system administrators will use. For example, `fdisk` creates or deletes partitions on a disk and lots of programs with `fs` in their name deal with managing file systems. `/sbin/halt`, run as root (or another user that you have allowed to do this), shuts down the system; there is also `/sbin/reboot`.

`/tmp` is a temporary filesystem that may be stored in RAM instead of on disk (but swapped out if necessary), and that does not have to survive rebooting the machine.

`/var` holds files that vary over time, such as logs or caches.

`/dev`, `/sys` and `/proc` are virtual file systems. One of the UNIX design principles is that almost every interaction with the operating system should look to a program like reading and writing a file, or in short _everything is a file_. For example, `/dev` offers an interface to devices such as hard disks (`/dev/sda` is the first SCSI disk in the system, and `/dev/sda1` the first partition on that), memory (`/dev/mem`), and a number of pseudoterminals or ttys that we will talk about later. `/proc` provides access to running processes; `/sys` provides access to system functions. For example, on some laptop systems, writing to `/sys/class/backlight/acpi_video0/brightness` changes the screen brightness.

The `/shared` folder is not part of the FHS, but is this unit's convention for a shared folder with the host on Vagrant virtual machines. In previous years we called this folder `/vagrant`, but given the default username on the VM is _also_ 'vagrant', this led to a lot of confusion, so we changed it.

### Package managers

Linux has had package managers and repositories since the days when it was distributed on floppy disks. A repository is a collection of software that you can install, and can be hosted anywhere - floppy disk, CD-ROM, DVD or nowadays on the internet. A package manager is software that installs packages from a repository - so far, this sounds just like an _app store_ but a package manager can do more. For one thing, you can ask to install different versions of a particular package if you need to. But the main point of a package manager is that packages can have dependencies on other packages, and when you install one then it installs the dependencies automatically.

To illustrate this, we're going to go on a tour of one kind of software with which you'll want to get very familiar: text editors that work in the console. Text editing is fundamental to a lot of system administration tasks as well as programming, and people often find that a familiar editor becomes a favourite tool. 

Two console-based text editors are already installed in Debian: `nano` and `vim`. 

`nano` is a basic text editor that works in the console, and is installed in most Linux distributions including the ones on seis and the lab machines, so you can use it to edit files remotely.  You can type `nano FILENAME` to edit a file. The keyboard shortcuts are at the bottom of the screen, the main one you need is Control+X to exit (it will ask if you want to save, if you have unsaved changes). Nano is considered fairly friendly as console editors go.

`vim` is the 1991 improved version of the even older (1976) `vi` editor (which is also installed). It is a modal editor with a steep learning curve, but its extremely powerful editing grammar and widespread availability mean it regularly appears towards the top of lists of favourite text editors. If you want to get started with vim, I suggest you start by typing `vimtutor` at the commandline -- this opens vim with a file that guides you through basic vim usage. 

Another console-based editor dating from the mid-70s is `emacs`, `vi`'s traditional Lisp-based rival. However, emacs is not installed by default: type `emacs` at the console and you will get `emacs: command not found`. You can install it with the command

```
sudo apt install emacs-nox
```

> **Note:** Matt uses Vim, and Gretch uses Emacs configured to be an awful lot like vim.  The old editors have a *steep* learning curve but are well worth learning at the *start* of your careers... they'll save you an awful lot of time later on.  Ask Gretch if you'd like to see her config files.

  * `sudo` (superuser do) allows you to run a command as root, also known as the administrator or superuser. Depending on how your system is configured, this might be not allowed at all (you can't do it on the lab machines), or require a password, but on the Vagrant box you're using you are allowed to do this. It is good practice to use sudo for system adminstration instead of logging in as root directly, but if you ever really need a root shell then `sudo bash` gets you one - with `#` instead of `$` as prompt to warn you that you are working as root.

  * `apt` is the Debian package manager.

  * `install PACKAGE` adds a package, which means download and install it and all its dependencies (you'll see a list of these to confirm you want to install them -- you do).

We're installing `emacs-nox` because this is the version of emacs packaged for use from the console. If you tried to install just `emacs` then the package manager would identify that you need a graphical display manager to run emacs' GUI mode and install a lot more dependencies to enable that, which we don't need. 

Now that emacs is installed, you can launch it with `emacs`, and from there you should see some introductory instructions, including how to access an emacs tutorial which will teach you how to use it. (If you want to exit emacs, Control-X followed by Control-C should do it).

Other popular editors include 

 + `mcedit`, a file editor which comes as part of the 'midnight commander' package, which you can install with `sudo apt install mc`. Launch the editor with `mcedit filename` and test it out (Alt-0 to exit).  

 + `tilde`, an editor with a GUI-esque menu system controlled through Alt-letter sequences. Install with `sudo apt install tilde`.

 + `micro`, a simple editor somewhat like an advanced version of `nano`. Install with `sudo apt install micro`.

You can also find out information about packages with `apt info PACKAGE` -- try this for one of the above.

I suggest that you try out some of these editors, and figure out how you prefer to edit files. Some of these tools might require time investment to learn, but doing this early in your CS career could be a good decision.

Whichever editor you end up deciding to use, you probably won't need to keep all the alternatives installed. You can leave `nano` and `vim` installed, but for the other editors you've tried out above and decided you don't like, you can (and should) remove them from the system with `sudo apt remove PACKAGE`.

### Update and upgrade

The repositories that you are using are recorded in `/etc/apt/sources.list`, have a look at this file with `cat` or `nano` to see where they are, then look up the sites in your browser. There are folders for different Debian versions and package index files for different architectures. 

Two commands a system adminstrator should run regularly for security reasons:

  * `sudo apt update` fetches the new package list from the repository. This way, apt can tell you if any packages have been updated to new versions since you last checked.

  * `sudo apt upgrade` upgrades every package that you already have installed to the latest version in your local package list (downloaded when you do an `apt update`).

### Lab machines

If you are running a virtual machine on the lab machines, then your virtual machine might not be around after the lab machine reboots or you log out and in again and end up on a different machine - as the notice when you log in tells you, the virtual machines are stored under `/tmp`.

It would be annoying to have to reinstall your favourite packages (like your chosen text editor) every time you log in to a different machine, so you should put them in your Vagrantfile and then `vagrant up` will do this for you automatically. Your Vagrantfile already contains a line beginning `echo`, you can put an `apt-get install PACKAGE` line below this one, and can list as many packages as you like. There is no `sudo` here because when Vagrant is installing the system, it is running as root automatically.

  * Unless it is `nano` or `vim`, add the package for your favourite text editor to this line so next time you rebuild the Vagrant machine, they are added automatically.

  * Log out of your vagrant machine and do a `vagrant destroy` which removes the virtual machine. Then reload with `vagrant up` which will download and provision the box again.

  * Log in with `vagrant ssh` and check that the editor is installed.


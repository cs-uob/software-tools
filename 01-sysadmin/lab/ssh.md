# Secure shell

Secure shell (SSH) is a protocol to allow you to remotely log in to another computer, such as a lab machine. Almost everyone who uses SSH uses the free OpenSSH implementation, which is standard on pretty much every Linux distribution and is also available for Windows and Mac - and even for the mobile operating systems iOS and Android.

We will see in more detail how SSH manages connections later on, but for now imagine that it opens a network connection between your own machine, and a shell running on a different machine. When you type something, SSH encrypts this and sends it to the other machine which decrypts it and passes it to the shell (or any other program you're running); when the shell replies then SSH encrypts that and sends it back to you. For this to work, (Open)SSH is actually two programs:

  * `ssh` is the client, which you run on your machine to connect to another machine.
  * `sshd` is the server, or _daemon_ in UNIX-speak. It runs in the background on the machine you want to connect to, and needs to be installed by the system administrator. Note: SSH uses TCP port 22 by default.

## Check your client

First of all, let's check that the ssh client is working.

  * Open a terminal on your own machine: Linux, Mac OS or Windows Subsystem for Linux should be fine. Windows 10 CMD might work too if you have the Windows version of OpenSSH installed (for example if you have git installed which uses ssh behind the scenes).
  * Type `ssh localhost` and press ENTER. Several different things could happen:
    - If it asks for a password, then the ssh client is working, and a ssh server is running on your current machine. The password would be your user account password, but we don't actually want to log in again so cancel with Control+C.
    - If it succeeds without a password, then the client is working and a ssh server is running on your machine and either you do not have a password, or you already have a key set up. Type `exit` and press ENTER to get back to your previous shell.
    - If it shows "connection refused", then you have the ssh client correctly working but no server running on your own machine. This is not a problem, as we're trying to log in to the lab machines, so we need a client on our machine and a server on the lab machine.
    - If it shows an error that ssh is not found, then you don't have (Open)SSH installed which is very unusual except on windows CMD - in which case please switch to using the windows subsystem for linux.

## Connect to the lab

The lab machines have names `it######.wks.bris.ac.uk` where the hashes represent a number from 075637 up to 075912. However, not all of them will be working at any one time, if everyone connects to the same machine then it will quickly get overloaded, and for security reasons the lab machines are not directly accessible from the internet. Instead, we will use two other machines to connect:

  * The bastion host `seis.bris.ac.uk`. This is reachable over SSH from the internet, and is on a university network that lets you connect further to the lab machines. You should not attempt to do any work on seis itself, as most of the software you would like to use (like compilers) is not installed there. However, you do have a home directory on seis for storing things like SSH keys.
  * The load balancer `rd-mvb-linuxlab.bristol.ac.uk`. This connects you to a lab machine that is currently running and ensures that if everyone uses this method to connect, then they will be more or less equally distributed among the running machines.

Try the following:

  * On your terminal, type `ssh USERNAME@seis.bris.ac.uk` where you replace USERNAME with your university username, e.g. `aa20123`. Obviously, you will need a working internet connection for this.
  * If it asks you whether you are sure, type `yes` and press ENTER. SSH will only do this the first time you connect to a machine that you have never used before.
  * When prompted, enter your university password and press ENTER.
  * You should now see the prompt on seis, which looks something like `-bash-4.2$`. Try the command `uname -a` to print information about the system (uname on its own prints the operating system name, `-a` shows "all" information). The reply line should start `Linux seis-shell`, which is the operating system and host name.
  * On the seis prompt, type `ssh rd-mvb-linuxlab.bristol.ac.uk`. This might take a few seconds; say yes if it asks you if you're sure, then enter your password again when prompted. We didn't have to give a username again because you are already logged in to seis with your university username (`whoami` shows this) and when you ssh without giving a username, it uses the one you are currently logged in as.
  * You should now be connected to a lab machine, with a prompt of the form `USERNAME@it######:~$`. 
  * Try `whoami` and `uname -a` to check who you are logged in as, and where; also try `hostname` which just prints the machine name.
  * Type `exit` twice to get back to your own machine. (Once gets you back to seis, twice closes the ssh connection completely.)

Connecting to one machine through another machine (in this case seis) as a proxy is such a common use case that ssh in fact has an option for it. Note however that this will not normally work from a windows CMD terminal, although it does work on Windows Subsystem for Linux (and on Mac and Linux).

```
ssh -J USERNAME@seis.bris.ac.uk USERNAME@rd-mvb-linuxlab.bristol.ac.uk
```

The `-J` for "jump through this host" even accepts a comma-separated list of hosts if you need to connect through more than one. However, you need to repeat your username for every machine.

You now know how to log in to a lab machine, but in both methods you had to type your password twice - let's make that easier. The answer is not to store your password in a file, but to use keys instead.

## Setting up ssh keys

When you connect to a machine, the client on your computer and the daemon on the machine you're logging in to run a cryptographic protocol to exchange keys and set up a shared secret key for the session, so that what one side encrypts the other side can decrypt again. It also authenticates you to the server using one of several methods. 

You might have heard from a security source that there are three main authentication factors: something you know (password or PIN), something you have (physical key, digital key, ID card, passport) and something you are (biometrics). An authentication method that requires two of these is called two-factor authentication and this is considered good security practice. For ssh, this means:

  * You can log in with a username and password, that is "something you know". This is the default, but not the most secure.
  * You can log in with a (digital) key, that is "something you have". This is more secure, as long as your key (which is just a file) doesn't get into the wrong hands, and also the most convenient as you can log into a lab machine or copy files without having to type your password.
  * You can log in with a key file that is itself protected with a password. This gets you two-factor authentication.

The keys that SSH uses implement digital signatures. Each key comes as a pair of files:

  * A private key (also known as secret key) in a file normally named `id_CIPHER` where CIPHER is the cipher in use. You need to keep this secure and only store it in places that only you have access to.
  * A public key in a file normally named `id_CIPHER.pub`. You can share this with the world, and you will need to store a copy of it on any machine or with any service that you want to log in to (for the lab, because the lab machines all share a file system, you only need to store it once - but seis has a separate file system so you need a separate copy there).

Let's create a key pair:

  * On your own machine, make sure you are not connected to a lab machine or seis, then type the command `ssh-keygen -t ed25519`. (If you get an "unknown key type" error, then you are using an outdated version of OpenSSH and for security reasons you should upgrade immediately.) _Note: type `ed25519` directly, do not replace this with your username. It stands for the "Edwards curve over the prime `2^255-19`" cryptographic group, if you want to know._
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

## Set up key access on SEIS

First, we need to upload our public key to the `~/.ssh` directory on seis. Even before this, we need to make sure the directory exists though:

  - Log in to seis with ssh and your password.
  - Try `ls -al ~/.ssh`. If it complains the folder doesn't exist, create it with `mkdir ~/.ssh`.
  - Log out of seis again with `exit`.

The command for copying a file is `scp` for secure copy, which works like `cp` but allows you to include remote hosts and does the copy over SSH. Run this from your own machine:

```
scp ~/.ssh/id_ed25519.pub "USERNAME@seis.bris.ac.uk:~/.ssh/"
```

Obviously, replace USERNAME with your university username. This will ask for your password again. Note two things here: first, to set up access on seis, we are uploading the public key - not the private key! - and secondly, that we put double quotes around the destination. This is because the `~` character meaning home directory is handled by our shell, but we don't want our local shell to expand it, instead we want the shell on seis launched by scp to expand it to our home directory on that machine.

The general syntax of scp is `scp source destination` and source or destination  may be of the form `[USERNAME@]HOSTNAME:PATH` - if it contains a colon (`:`), then it refers to a file on a different machine.

Now log in to seis over ssh and type your password one last time. Then run the following:

```
cd .ssh
cat id_ed25519.pub >> authorized_keys
chmod 600 authorized_keys
```

SSH will accept a public key if it is listed in the file `authorized_keys` in the user's `.ssh` folder, the format is one line per key. Instead of just copying `id_ed25519.pub` to `authorized_keys`, which would overwrite the latter file if it already existed, we use the construction `cat SOURCE >> DEST` to have our shell append the source file to the destination. _Note: it's **authorized**, the American spelling -- if you use the British spelling here OpenSSH won't know to read that file._

However, if the authorised keys file didn't exist already, then it has now been created with default permissions and SSH won't accept that for security reasons. `chmod` means change permissions (also known as "mod bits") and 600 is the bit pattern we want in base 8, because that is how permissions work for historical reasons. Permissions are a bitfield of 9 bits, the first three are read/write/execute for the owner, the next three the same for the group, and then for everyone else. If you `ls -l` you will see this in a slightly more human-readable format, namely `rw-------` where a minus means that a bit is turned off.

Now type `exit` to get back to your own machine, and then `ssh USERNAME@seis.bris.ac.uk` to log back in to seis. It should log you in without asking for a password, and you have now set up key-based SSH authentication for seis.

_Note: if you set a password on your SSH key earlier, then it will ask you for a password, and it will expect the key password not your uni password. You know not to ever reuse your uni password for anything else, right?_

If for some reason something doesn't work with ssh, the first thing to try is to add the `-v` switch enable debugging information (you can even do `-vv` or `-vvv` to see even more detail, but we don't need that). If there is a problem with the permissions on your private key file for example, then you will see SSH complain in the debugging information.

## Setting up keys for lab machines

You can now get into seis with a key, but you want to be on a lab machine to get work done.

To connect from your machine to seis, you need a private key on your machine and a public key on seis. To connect from seis to a lab machine, it would seem like you need a public key on the lab machine and a private key on seis. You do not want to upload your private key to seis though for security reasons, so instead we are going to use a SSH feature called _agent forwarding_ which means that if you SSH into one machine, then when you try and SSH further into another machine SSH will reuse the same key. The way to do this is to use the `-A` command line flag.

The point of key-based authentication is that your private key never leaves your own machine, so even university administrators never get to see it, which would not be guaranteed if you stored a copy on a university machine.

Logging in to a machine does not send the key to that machine. Instead, the machine sends you a challenge - a long random number - and SSH digitally signs that with the private key on your own machine, and sends the signature back which the remote machine can verify with the public key. Seeing a signature like this does not let the machine create further signatures on your behalf, and it definitely does not reveal the key.

What agent forwarding does is it allows challenges and signatures to be forwarded across multiple connections, but the key never leaves your own machine.

This way, you can create one SSH key and use it for university, github and anything else that you access over SSH, and even if one service is breached then this does not give the attacker access to your accounts on the other services.

To set this up:

  * Log in to seis with `ssh USERNAME@seis.bris.ac.uk`. You should not need a password anymore.
  * Log in to the lab machines with `ssh rd-mvb-linuxlab.bristol.ac.uk` and enter your password. Check that the `~/.ssh` folder exists and create it if it doesn't, as you did before on seis, then `exit` again to seis.
  * Copy your public key file from seis to the lab machines with `scp ~/.ssh/id_ed25519.pub "rd-mvb-linuxlab.bristol.ac.uk:~/.ssh/"`. This will ask for your password again.
  * Log in to a lab machine with `ssh rd-mvb-linuxlab.bristol.ac.uk` and enter your password one last time. On the lab machine, install the public key with the following:

```
cd .ssh
cat id_ed25519.pub >> authorized_keys
chmod 600 authorized_keys
```

  - Log out of the lab machine and seis again by typing `exit` twice.

The steps above were necessary because your home directory on seis is not the same as on the lab machines. However, your home directory is the same across all lab machines, so you don't need to install the key on each one separately. You might have noticed that when copying or `ssh`-ing from seis to the lab machines, you don't have to repeat your username: this is because it is the same on all these machines.

From now on, from you own machine, you should be able to get directly into a lab machine with the following command, which should not ask for your password at all:

```
ssh -A -J USERNAME@seis.bris.ac.uk USERNAME@rd-mvb-linuxlab.bristol.ac.uk
```

_Unfortunately, `-J` will not work on a windows CMD terminal, although it should work on Windows Subsystem for Linux. Once we have set up a configuration file, there will be a way to work around this problem. Mac and Linux users should be fine though, as should anyone running these commands from a Linux VM on their own machine, whatever their host OS._

## Setting up a configuration file

You now have a log in command that works, but you still have to type a lot, and you need to type your username twice. We can improve this by using a configuration file.

SSH reads two configuration files: one for all users at `/etc/ssh/ssh_config` (`/etc` is where POSIX programs typically store global settings) and a per-user one at `~/.ssh/config`. The site [https://www.ssh.com/ssh/config/](https://www.ssh.com/ssh/config/) or just `man ssh_config | less` on a terminal contain the documentation (`man` means manual page, and `less` is a program that shows a file on page at a time and lets you scroll and search).

Create a file called simply `config` in your `.ssh` directory on your own machine. You can do this for example with `touch config` (make sure you're in the `.ssh` directory first, `cd ~/.ssh` gets you there), and then editing it in your favourite text editor. Add the following lines, replacing USERNAME with your username twice:

```
Host seis
  HostName seis.bris.ac.uk
  User USERNAME

Host lab
  HostName rd-mvb-linuxlab.bristol.ac.uk
  ProxyJump seis
  User USERNAME
```

This now lets you use simply `ssh lab` to log in to a lab machine via seis (agent forwarding is implied when you use `ProxyJump`), or `ssh seis` if you want to access seis directly for example to update your keys there.

 * Try `ssh lab` from your own machine. This will be your main way to log in to a lab machine from now onwards.


If you are on Windows and are using OpenSSH through a CMD terminal, a bug in OpenSSH prevents the `-J` option from working. However, you can write your file like this instead:

```
# ~/.ssh/config file for WINDOWS CMD users only

Host seis
  HostName seis.bris.ac.uk
  User USERNAME

Host lab
  HostName rd-mvb-linuxlab.bristol.ac.uk
  ProxyCommand ssh.exe -W %h:%p seis
  User USERNAME
```

This should get `ssh lab` to work for you as well.

## Using different keys

You do not need this for the lab, but if you are ever managing different systems and accounts then you might use a different key file for each one. In this case, ssh on the command line lets you do `-i FILENAME` to select a private key file, and in the configuration file you can select a file for a particular host with the `IdentityFile FILENAME` line. By default, ssh will search for files in `.ssh` with names `id_CIPHER`, as you can see if you launch a connection with the `-vv` parameter which shows detailed debugging information.

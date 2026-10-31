canRead(U,F) :- user(U), file(F), owns(U,F), userReadBitSet(F).
canRead(U,F) :- user(U), group(G), file(F), member(U,G), owns(G,F), groupReadBitSet(F).
canRead(U,F) :- user(U), file(F), otherReadBitSet(F).

user(matthew).
user(wehttam).

group(realusers).

member(matthew, realusers).

file('slides.md').
file('README.md').
file('dac.pl').

owns(matthew, 'slides.md').
owns(realusers, 'slides.md').
owns(realusers, 'README.md').

userReadBitSet('README.md').
groupReadBitSet('README.md').
otherReadBitSet('dac.pl').

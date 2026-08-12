file('.ssh/id_ed25519').
file('jos-diary').
user('matt'). user('jo'). group('users').

canRead(U,F):- user(U), file(F),
    owns(U,F), userReadBitSet(F).

canRead(U,F):- user(U), group(G), file(F),
    member(U,G), owns(G,F), groupReadBitSet(F).

canRead(U,F):- user(U), file(F),
    otherReadBitSet(F).

owns('matt','.ssh/id_ed25519').
owns('jo','jos-diary').
member('matt','users').
member('jo','users').
userReadBitSet('.ssh/id_ed25519').
userReadBitSet('jos-diary').
otherReadBitSet('.ssh/id_ed25519').

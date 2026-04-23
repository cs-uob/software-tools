#! /usr/bin/env python3
# Thoroughly untested code for playing Cribbage with...

import random

from cribbage.agents import *
from cribbage.game import *

def main():
    ai = Martin()
    human = Martin()
    game = Game([human, ai])
    game.play()

if __name__=='__main__':
    main()

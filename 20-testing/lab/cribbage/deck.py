#! /usr/bin/env python3
import random
from cribbage.card import *
from cribbage.round import *


class Deck:
    "A deck of playing cards"

    def __init__(self):
        self._deck = []
        for rank in RANKS:
            for suit in SUITS:
                self._deck.append(Card(rank, suit))

    def shuffle(self):
        """Shuffle the deck."""
        random.shuffle(self._deck)

    def deal(self):
        PLAYERS = 2
        CARDS = 6
        self.shuffle()
        deck = self._deck.copy()
        hands = [[] for p in range(PLAYERS)]
        for i in range(CARDS):
            for p in range(PLAYERS):
                hands[p].append(deck.pop())
                turn = deck.pop()

        return Round(hands, turn)


if __name__ == "__main__":
    pass
    # TODO: Add some tests!

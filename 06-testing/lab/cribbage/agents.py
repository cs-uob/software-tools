#! /usr/bin/env python3
import random

class Agent:
    "A generic agent for playing cribbage."

    def choose_discards(self, cards):
        """Choose which cards to discard to the box."""
        pass

    def choose_play(self, cards):
        """Choose what cards to play in the play."""
        pass


class Martin(Agent):
    """Martin has decided chess really isn't for him and he wants to
    learn cribbage.  Unfortunately he's not any better at it…

    A simple cribbage playing AI.
    """

    def choose_discards(self, cards):
        random.shuffle(cards)
        return cards[:2]

    def choose_play(self, cards):
        random.shuffle(cards)
        card = cards[0]
        return card


class Human(Agent):
    """A human playing cribbage. Hearts spades clubs and diamonds are written H, S, C, D respectively."""

    def choose_discards(self, cards):
        for card in cards:
            card.reveal()

        output = "Your hand: "
        for card in cards:
            output += str(card) + " "
            output += "\n"
            print(output)

        first = Card(input("Discard a card: ").upper().strip())
        second = Card(input("Discard another: ").upper().strip())
        return [first, second]

    def choose_play(self, cards):
        for card in cards:
            card.reveal()

        output = "You can play: "
        for card in cards:
            output += str(card) + " "
            output += "\n"
            print(output)

        play = Card(input("Play a card: ").upper().strip())
        return play


if __name__ == "__main__":
    pass

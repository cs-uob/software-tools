#! /usr/bin/env python3
import copy
from cribbage.util import *


class Round:
    "A round of a game of crib."

    def turn_card(self):
        "Turn over the turn card."
        self._turn.reveal()
        return self._turn

    def get_hands(self):
        return copy.deepcopy(self._hands)

    def get_box(self):
        return copy.deepcopy(self._box)

    def get_box(self):
        return copy.deepcopy(self._box)

    def __init__(self, hands, turn, box=[]):
        self._hands = hands
        self._turn = turn
        self._box = box

        for hand in self._hands:
            for card in hand:
                card.hide()

        for card in self._box:
            card.hide()

        self._turn.hide()

    def _discard(self, player, discard):
        """After being dealt your cards each player discards two cards
        (or one card if playing with three or four players and a deal
        of 5 cards) to The Box."""
        hand = self._hands[player]
        new_hand = [card for card in hand if card != discard]
        discard.hide()
        self._box.append(discard)
        self._hands[player] = new_hand

    def discard(self, player, agent):
        """Let an agent decide what to discard from their hand."""
        discards = agent.choose_discards(self._hands[player])
        for card in discards:
            self._discard(player, card)

    def __str__(self):
        output = "Player 0's hand: "
        output += str_cards(self._hands[0])
        output += "\n"
        output += "Player 1's hand: "
        output += str_cards(self._hands[1])
        output += "\n"
        output += "Turn: " + str(self._turn) + " Box: "
        output += str_cards(self._box)
        output += "\n"
        return output

    def __repr__(self):
        state = {"hands": self._hands, "turn": self._turn, "box": self._box}
        return state.__repr__()


if __name__ == "__main__":
    pass

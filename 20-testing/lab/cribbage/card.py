#! /usr/bin/env python3

SUITS = ["♠", "♥", "♣", "♦"]
RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]


class Card:
    """A single playing card."""

    def reveal(self):
        "Reveal a playing card."
        self.is_hidden = False

    def hide(self):
        "Hide a playing card."
        self.is_hidden = True  # DEBUG: Set to false to always be able to see the cards

    def value(self):
        """In cribbage, cards are worth their number of pips, or 10 if
        a face card.  Aces are always low."""
        return {
            "A": 1,
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6,
            "7": 7,
            "8": 8,
            "9": 9,
            "10": 10,
            "J": 10,
            "Q": 10,
            "K": 10,
        }[self._rank]

    def rank(self):
        """Convert a card's rank into a numeric value."""
        return {
            "A": 1,
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6,
            "7": 7,
            "8": 8,
            "9": 9,
            "10": 10,
            "J": 11,
            "Q": 12,
            "K": 13,
        }[self._rank]

    def suit(self):
        """Convert a card's suit into a numeric value."""
        return {"♠": 3, "♥": 2, "♣": 0, "♦": 1}[self._suit]

    def is_black_jack(self):
        """Black Jacks are special in cribbage and score 1 in the play
        (one for his nob), or 2 for the dealer if revealed on the
        turn."""
        return self._is_black() and self._rank == "J"

    def __init__(self, value, suit=""):
        """Create a new card with a given value.  The value should be
        read as a single character representing the rank of the card,
        followed by the suit as a single initial.  For example:
        - JH is the Jack of Hearts
        - 5C is the 5 of Clubs
        - 1D is the Ace of Diamonds

        If an optional suit is provided then the value is just the
        rank.
        """
        self.is_hidden = False

        value = value.strip()

        if suit == "":
            if len(value) == 3:
                self._rank = 10
            else:
                self._rank = value[0]
                self._suit = {"S": "♠", "H": "♥", "C": "♣", "D": "♦"}[value[-1]]
        else:
            self._rank = value
            self._suit = suit

    def __str__(self):
        """Convert a card into a string."""
        if self.is_hidden:
            return self.__repr__()
        else:
            REDFG = "\x1b[0;31m"
            BLACKFG = "\x1b[0;30m"
            WHITEBG = "\x1b[0;47m"
            RESETTEXT = "\x1b[0m"

            colorcode = WHITEBG
            if self._is_red():
                colorcode += REDFG
            else:
                colorcode += BLACKFG

            return colorcode + self.__repr__() + RESETTEXT

    def __repr__(self):
        """Convert the card into a string on a REPL."""
        if self.is_hidden:  # and False: # DEBUG HACK
            return "▒▒▒"
        else:
            space = " "
            if self._rank == "10":
                space = ""
            return space + self._rank + self._suit

    def _is_red(self):
        """Is a card a red card?"""
        if self._suit == "♥" or self._suit == "♦":
            return True
        else:
            return False

    def _is_black(self):
        """Is a card a black card?"""
        return not self._is_red()

    def __sub__(self, card):
        """Subtract two cards ranks."""
        return self.rank() - card.rank()

    def __eq__(self, card):
        """Is the card this card?"""
        return self._suit == card._suit and self._rank == card._rank

    def __lt__(self, card):
        """Is this less than this card?"""
        this = self.rank() * 100 + self.suit()
        that = card.rank() * 100 + card.suit()
        return this < that

    def __hash__(self):
        return hash((self.suit(), self.rank()))


if __name__ == "__main__":
    pass
    # TODO: add some tests!

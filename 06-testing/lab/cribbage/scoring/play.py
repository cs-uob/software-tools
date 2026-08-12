from cribbage.util import *
import itertools
import operator

class Play:
    def __init__(self):
        self._played = []
        self.count = 0

    def play(self, card):
        self._played.append(card)
        self.count += card.value()

        tricks = []
        tricks += self.check_fifteens()
        tricks += self.check_thirtyone()
        tricks += self.check_pairs()
        tricks += self.check_runs()
        tricks += self.check_nob()

        return tricks

    def check_fifteens(self):
        if self.count == 15:
            return [Fifteen(self._played)]
        return []

    def check_thirtyone(self):
        if self.count == 31:
            return [ThirtyOne(self._played)]
        return []

    def check_pairs(self):
        if len(self._played) >= 4 and all_equal([card.rank() for card in self._played[-4:]]):
            return [PairImperiale(self._played[-4:])]
        elif len(self._played) >= 3 and all_equal(
                [card.rank() for card in self._played[-3:]]
        ):
            return [PairRoyale(played[-3:])]
        elif len(self._played) >= 2 and all_equal(
                [card.rank() for card in self._played[-2:]]
        ):
            return [Pair(self._played[-2:])]
        return []

    def check_runs(self):
        for n in range(len(self._played), 2, -1):
            run = list(sorted(self._played[-n:]))
            differences = list(map(operator.sub, run[1:], run[:-1]))
            if all_equal(differences, 1):
                return [Run(run)]
        return []


    def check_nob(self):
        if self._played[-1].is_black_jack():
            return [Nob(self._played[-1])]
        return []
            

class Trick:
    """A trick to be pegged."""
    def __init__(self, name, points, hand):
        self.name = name
        self.points = points
        self.hand = hand

class Nob (Trick):
    """Mind out of the gutter… nob is an old word for 'his lordship'."""
    def __init__(self, hand):
        super().__init__("One for his nob", 1, hand)

class Fifteen (Trick):
    def __init__(self, hand):
        super().__init__("Fifteen", 2, hand)

class ThirtyOne (Trick):
    def __init__(self, hand):
        super().__init__("Thirty-one", 1, hand)
    
class Pair (Trick):
    def __init__(self, hand):
        super().__init__("Pair", 2, hand)

class PairRoyale (Trick):
    def __init__(self, hand):
        super().__init__("Pair Royale", 6, hand)

class PairImperiale (Trick):
    def __init__(self, hand):
        super().__init__("Pair Royale", 12, hand)

class Run (Trick):
    def __init__(self, hand):
        super().__init__("Run", len(hand), hand)

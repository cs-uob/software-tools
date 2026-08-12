from cribbage.util import *
import copy
import itertools
import operator


def fifteens(cards):
    """Find combinations of cards whose value adds up to 15."""
    fifteens = []
    for n in range(len(cards)):
        for combo in itertools.combinations(cards, n):
            if sum(map(lambda c: c.value(), combo)) == 15:
                fifteens.append(combo)
    return fifteens


def pairs(cards):
    """Find combinations of cards with matching ranks."""
    pairs = []
    for _, combo in itertools.groupby(
        sorted(cards, key=lambda card: card.rank()), lambda card: card.rank()
    ):
        trick = copy.deepcopy(list(combo))
        if len(trick) >= 2:
            pairs.append(trick)
    return pairs


def runs(cards):
    """Find combinations of cards with subsequent ranks."""
    runs = []
    for n in range(len(cards),2,-1):
        for combo in sorted(itertools.combinations(cards, n), key=len, reverse=True):
            run = list(sorted([card.rank() for card in combo]))
            differences = list(map(operator.sub, run[1:], run[:-1]))
            if all_equal(differences, 1):
                new = True
                for run in runs:
                    if subset(combo, run):
                        new = False
                        break
                if new:
                    runs.append(combo)
    return runs


def flushes(cards):
    """Find if the hand is all the same suit and return the points to be scored."""
    hand = cards[:-1]
    turn = cards[-1]
    flushes = 0
    if all_equal([card.suit for card in hand], hand[0].suit):
        if hand[0].suit == turn.suit:
            flushes = 5
        else:
            flushes = 4
    return flushes

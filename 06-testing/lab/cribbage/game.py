#! /usr/bin/env python3
from cribbage.card import *
from cribbage.deck import *
from cribbage.round import *
from cribbage.util import *
import cribbage.scoring

import copy
import itertools
import random


class Game:
    """A game of cribbage"""

    def __init__(self, agents):
        self._players = agents

        self._box = random.randint(0, len(agents) - 1)
        self._target = 121
        self._score = [0 for player in self._players]
        self._backpeg = [None for player in self._players]
        self._deck = Deck()
        self._round = 0

    def __str__(self):
        line = f"Round {self._round}"
        underscore = "=" * len(line)
        return "\n\n" + line + "\n" + underscore + "\n"

    def play(self):
        "Play a whole game of cribbage."
        try:
            while True:
                self.play_round()
        except Winner as winner:
            print(f"Player {winner.winner} wins!")
            return

    def play_round(self):
        "Play a round of cribbage."
        self._round += 1
        print(self)

        round = self._deck.deal()
        print(round)
        round._box = []

        for i in range(len(self._players)):
            player = self._players_turn(i)

            print(f"Player {player} is discarding…")
            round.discard(player, self._players[player])

        turn = round.turn_card()
        print(f"Turning over the top card: {turn}")
        if turn.is_black_jack():
            print("--- Two for his heals!")
            self.score(self._box, 2)

        print(round)

        cards = round.get_hands()
        self._play_play(cards)

        cards = round.get_hands()
        self._play_hands(cards, turn)

        print(f"It's Player {self._box}'s box…")
        box = round.get_box()
        for card in box:
            card.reveal()
        self._play_hand(self._box, box, turn)

        self._box = (self._box + 1) % len(self._players)

    def _play_play(self, cards):
        """The play is the first scoring round.  The player to the
        right of The Box starts and we lay down cards in turn until we
        get to 31.  If you exceed 31 then we start a new play from 0
        with the remaining cards.  If a player reaches 31 exactly then
        they can peg 2.  Pairs score 2, triples (pair royale) 6, and
        quadriples (pair imperiale) 12.  Runs over 3 cards score the
        number of cards in the run (but they don't need to be
        subsequent... that is playing 2, 3 then 4 would score 3, but
        then laying an ace would score 4).  Flushes don't score
        anything in the play."""

        play = cribbage.scoring.play.Play()
        round = 0
        knocks = 0
        last_played = None
        while True:
            p = self._players_turn(round + 1)
            agent = self._players[p]
            players_cards = cards[p]
            if len(players_cards) == 0:
                print(f"Player {p} is out of cards")
            else:
                print(f"Player {p} looks at their cards: {str_cards(players_cards)}")
            valid_cards = [card for card in players_cards if play.count + card.value() <= 31]
            if len(valid_cards) == 0:
                print(f"Player {p}: *knocks*")
                knocks += 1
            else:
                last_played = p
                knocks = 0
                chosen_card = agent.choose_play(valid_cards)
                chosen_card.reveal()
                cards[p].remove(chosen_card)
                tricks = play.play(chosen_card)
                print(f"Player {p} plays {chosen_card} for {play.count}")
                for trick in tricks:
                    print(f'--- {trick.name} for {trick.points}')
                    self.score(p, trick.points)

            round += 1

            if play == 31 or knocks == len(self._players):
                if last_played == None:
                    print("\nThe play is over!\n")
                    return
                else:
                    print(f"Player {last_played} scores 1 for last card")
                    self.score(last_played, 1)
                    knocks = 0
                    last_played = None
                    play = cribbage.scoring.play.Play()
                    print("\nA new round of the play begins!\n")

    def _play_hands(self, hands, turn):
        for p in range(len(hands)):
            print(f'\nPlayer {p} plays their hand!\n')
            hand = hands[p]
            for card in hand:
                card.reveal()
            self._play_hand(p, hand, turn)

    def _play_hand(self, p, hand, turn):
        """Hands in crib score as follows.
        - Combos whose value adds up to 15 score 2 per combo
        - Combos of pairs score as the do in the hand
        - Runs of sequential cards longer than 3 score their length
        - Flushes in your hand score 4, 5 if the turn also matches.
        """
        cards = copy.deepcopy(hand + [turn])
        print(f"Player {p}'s hand: {str_cards(cards)}")

        fifteens = cribbage.scoring.hand.fifteens(cards)
        pairs = cribbage.scoring.hand.pairs(cards)
        runs = cribbage.scoring.hand.runs(cards)
        flushes = cribbage.scoring.hand.flushes(cards)

        score = 0
        for trick in fifteens:
            score += 2
            print(f"--- Fifteen {score}: {str_cards(trick)}")

        for trick in pairs:
            if len(trick) == 2:
                score += 2
                print(f"--- Twos a pair {score}: {str_cards(trick)}")
            elif len(trick) == 3:
                score += 6
                print(f"--- Pair royale! {score}: {str_cards(trick)}")
            elif len(trick) == 4:
                score += 12
                printf(f"--- Pair imperiale! {score}: {str_cards(trick)}")

        for trick in runs:
            print(
                f"--- {', '.join(map(str, range(score+1, score+len(trick)+1)))}: {str_cards(trick)}"
            )
            score += len(trick)

        if flushes > 0:
            score += flushes
            print(f"--- Flush {str_cards(flushes)}")

        if score == 0:
            # There is no valid hand in cribbage that scores 19.
            print(f"--- …I've got 19.")
        elif score == 4:
            print(f"--- …and the rest don't score!")

        if score > 0:
            print(f"Player {p} scores {score} in the hand")
            self.score(p, score)

        return score

    def score(self, player, amount):
        """Cribbage has a slightly strange scoring system where we
        'peg' points by moving matchsticks up a board.  Traditionally
        everyone has two pegs with the further back peg keeping track
        of the points you had before you last scored."""
        if amount > 0:
            self._backpeg[player] = self._score[player]
            self._score[player] += amount

            self._print_scores()

            if self._score[player] >= self._target:
                raise Winner(player)

    def _players_turn(self, i):
        """The player who has The Box goes first in the play but last
        in the hand."""
        return (i + self._box) % len(self._players)

    def _print_scores(self):
        for p in range(len(self._players)):
            backpeg = self._backpeg[p]
            peg = self._score[p]
            board = ["○"] * 60
            if peg != None and peg > 0:
                board[(peg - 1) % 60] = "●"
            if backpeg != None and backpeg > 0:
                board[(backpeg - 1) % 60] = "●"

            up = board[:30]
            down = board[30:]
            down.reverse()

            print(f"┌{'─'*36}┐ Player {p}: {peg} Lap: {1+peg//60} of 2")
            print(
                f"│{''.join(up[0:5])} {''.join(up[5:10])} {''.join(up[10:15])}  {''.join(up[15:20])} {''.join(up[20:25])} {''.join(up[25:30])}│"
            )
            print(
                f"│{''.join(down[0:5])} {''.join(down[5:10])} {''.join(down[10:15])}  {''.join(down[15:20])} {''.join(down[20:25])} {''.join(down[25:30])}│"
            )
            print(f"└{'─'*36}┘")


class Winner(BaseException):
    """Thrown when someone wins."""

    def __init__(self, player):
        self.winner = player

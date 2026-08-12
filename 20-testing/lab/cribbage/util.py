def all_equal(list, value=1):
    """Check whether every value in a list is equal"""
    return len(set(list)) == 1 and list[0] == value


def subset(a, b):
    """Check if every element of a is in b."""
    try:
        [b.index(i) for i in a]
        return True
    except ValueError:
        return False


def str_cards(cards):
    """Display some cards."""
    return " ".join([str(card) for card in sorted(cards)])

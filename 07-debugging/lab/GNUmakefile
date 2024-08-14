CFLAGS=-g -O0
CRACKMES=$(patsubst %.c,%,$(wildcard *.c))
.default: all
.phony: all clean
all: $(CRACKMES)
clean:
	$(RM) -rf $(CRACKMES)

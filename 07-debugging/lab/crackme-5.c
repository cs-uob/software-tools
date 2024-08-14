#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>
#include "solutions.h"

#define MEMORY_SIZE 10

static char memory[MEMORY_SIZE];
static int i = 0;
static bool failed = false;

void interpret(char);

int main(void) {
  char in;
  printf("What is the password?\n");
  while ((in = getchar()) != EOF && (in != '\n'))
    interpret(in);

  if (strncmp(memory, PASSWORD_5, MEMORY_SIZE) == 0 && !failed)
    printf("You win!\n");
  else 
    printf("Nope\n");
    
  return (failed == true);
}

void interpret(char command) {
  switch (command) {
  case 'z':
    memory[i] = 0;
    break;

  case '>':
    i = (i + 1) % MEMORY_SIZE;
    break;

  case '<':
    i = (i - 1) % MEMORY_SIZE;
    break;

  case '+':
    memory[i] += 1;
    break;
   
  case '-':
    memory[i] -= 1;
    break;

  case 'c':
    memory[i] = memory[(i-1)%MEMORY_SIZE];
    break;

  case 'd':
    memory[i] *= 2;
    break;

  case 'U':
    memory[i] = toupper(memory[i]);
    break;

  case 'l':
    memory[i] = tolower(memory[i]);
    break;
    
  case '.':
    fprintf(stderr, "[DEBUG] m[%d]='%c' (0x%02x %d)\n",
            i, memory[i], memory[i], memory[i]);
    break;
    
  default:
    failed = true;
    break;
  }
  return;
}

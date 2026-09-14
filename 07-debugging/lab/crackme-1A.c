#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "solutions.h"

int main(void) {
  char *input = NULL;
  size_t alloc_len = 0;
  size_t input_len = 0;
  int result;
  char *fullstring = PASSWORD_1A;
  char string[5] = {0};

  printf("What is the password?\n");
  if ((input_len = getline(&input, &alloc_len, stdin)) < 0)
    return 1;
  input[input_len-1] = '\0';

  strncpy(string, fullstring, 4);
  /* HINT: Pna lbh oernx ba fgepzc? */
  if (strcmp(input, string) == 0) {
    printf("You win!\n");
    result = 0;
  } else {
    printf("Nope\n");
    result = 1;
  }

  if (input != NULL) free(input);
  return result;
}

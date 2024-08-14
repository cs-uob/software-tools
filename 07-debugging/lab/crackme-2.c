#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "solutions.h"

int main(void) {
  char *input = NULL;
  size_t alloc_len = 0;
  size_t input_len = 0;
  int result;

  printf("What is the password?\n");
  if ((input_len = getline(&input, &alloc_len, stdin)) < 0)
    return 1;
  input[input_len-1] = '\0';

  /* HINT: Pna lbh oernx ba gurfr grfgf? */
  if (input_len == 11 &&
      input[0] == PASSWORD_2A &&
      input[2] == PASSWORD_2C &&
      input[8] == PASSWORD_2I &&
      input[3] == PASSWORD_2D &&
      input[9] == PASSWORD_2J &&
      input[6] == PASSWORD_2G &&
      input[1] == PASSWORD_2B &&
      input[5] == PASSWORD_2F &&
      input[4] == PASSWORD_2E &&
      input[7] == PASSWORD_2H &&
      input[10] == '\0') {
    printf("You win!\n");
    result = 0;
  } else {
    printf("Nope\n");
    result = 1;
  }

  if (input != NULL) free(input);
  return result;
}

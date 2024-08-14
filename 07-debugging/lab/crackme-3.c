#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "solutions.h"

int main(void) {
  char *input = NULL;
  size_t alloc_len = 0;
  int input_len = 0;
  int result;

  printf("What is the password?\n");
  if ((input_len = getline(&input, &alloc_len, stdin)) < 0)
    return 1;
  input[input_len-1] = '\0';


  /* HINT: Lbh pna frr ubj gur cnffjbeq vf rapelcgrq naq jurer vgf fgberq... */
  for (int i=0; i < input_len -1; i++)
    input[i] ^= 0x42;

  if (strlen(input) == strlen(PASSWORD_3) &&
      strcmp(input, PASSWORD_3) == 0) {
    printf("You win!\n");
    result = 0;
  } else {
    printf("Nope\n");
    result = 1;
  }

  if (input != NULL) free(input);
  return result;
}

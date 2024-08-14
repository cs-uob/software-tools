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

  SRAND(0);
  result = rand(); 
  
  /* HINT: Gurer ner n srj jnlf gb qb guvf. FENAQ pnyyf fenaq ba Yvahk
  naq fenaq_qrgrezvavfgvp ba BcraOFQ... jul abg purpx gurve zna cntrf?
  */
  if (atoi(input) == result) {
    printf("You win!\n");
    result = 0;
  } else {
    printf("Nope\n");
    result = 1;
  }

  if (input != NULL) free(input);
  return result;
}

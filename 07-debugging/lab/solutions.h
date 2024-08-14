#pragma once

#define PASSWORD_1 "Beetlejuice"

#define PASSWORD_2A 'B'
#define PASSWORD_2B 'e'
#define PASSWORD_2C 't'
#define PASSWORD_2D 'e'
#define PASSWORD_2E 'l'
#define PASSWORD_2F 'g'
#define PASSWORD_2G 'e'
#define PASSWORD_2H 'u'
#define PASSWORD_2I 's'
#define PASSWORD_2J 'e'

#define PASSWORD_3 "\x0f\x27\x11\x23\x3b\x06\x23\x3b\x72\x2a"

#ifdef __OpenBSD__
#define SRAND srand_deterministic
#else
#define SRAND srand
#endif

#define PASSWORD_5 "B3t3Lg3uS3"

#! /usr/bin/env bash
gmake -B all

printf "Crackme 1: "
>/dev/null ./crackme-1 <<<"Beetlejuice" && printf "PASS\n" || printf "FAIL\n";
printf "Crackme 2: "
>/dev/null ./crackme-2 <<<"Betelgeuse" && printf "PASS\n" || printf "FAIL\n";
printf "Crackme 3: "
>/dev/null ./crackme-3 <<<"MeSayDay0h" && printf "PASS\n" || printf "FAIL\n";
printf "Crackme 4: "
>/dev/null ./crackme-4 <<<"12345" && printf "PASS\n" || printf "FAIL\n";
printf "Crackme 5: "
>/dev/null ./crackme-5 <<<"z+dddddd++>z+dd+dd+++++d+>c>c<+++++++d>>c>c>c>c>c>c<<<<<<>-------------d>cl----->>++++++++d->---------d->" && printf "PASS\n" || printf "FAIL\n";
 

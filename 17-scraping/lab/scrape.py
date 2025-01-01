from bs4 import BeautifulSoup
import os


for file in os.listdir('cattax'):
  if file[-4:] == 'html':
    soup = BeautifulSoup(open('cattax/'+file,'r'), features='html.parser')
    print(soup.title.text + " : " + soup.h1.text)


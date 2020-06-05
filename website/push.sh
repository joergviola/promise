#!/bin/bash
set -e

DIST=docs/.vuepress/dist

mv $DIST/.git $DIST/../.git 

npm run docs:build

mv $DIST/../.git $DIST/.git 
cd $DIST

echo "Pushing..."
git add .
git commit -a -m "`date`"
git push
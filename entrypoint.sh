#!/bin/bash

sc -u $SAUCE_USERNAME -k $SAUCE_ACCESS_KEY -l ./foo.txt &
while ! grep "Sauce Connect is up, you may start your tests." foo.txt ; do
    echo "Sauce Connect is booting..."
    sleep 1
done

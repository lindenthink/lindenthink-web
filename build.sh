#!/bin/bash
npm -v
npm install
nps -v
nps build
rm -rf /home/nginx/webroot/*
mv dist/* /home/nginx/webroot
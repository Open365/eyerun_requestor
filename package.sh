#!/bin/sh

set -e
set -u
set -x

npm install
bower install -f
grunt build-client

mkdir pkgs
tar -czvf pkgs/eyerun_accessorArtifact.tar.gz ./build/ bower.json

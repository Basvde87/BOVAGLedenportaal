#!/bin/bash
BASEDIR=$(dirname $0)

cp --recursive --force --verbose "$BASEDIR/assets" "$BASEDIR/../Kentico/CMS/assets"

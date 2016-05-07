#!/bin/bash
set -e

#psql -f scripts/setup_structure.sql

psql -f scripts/user_schema.sql users
psql -f scripts/import_INT_20150731.sql snomedct
psql -f scripts/INT_20150731_schema.sql tmp

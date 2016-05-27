#!/bin/bash
set -e

psql -f scripts/user_schema.sql users
psql -f scripts/snomed_schema.sql snomed
psql -f scripts/import_INT_20150731.sql old_snomedct

python3 scripts/transfer_data.py snomedct snomed

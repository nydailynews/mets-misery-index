#!/bin/bash
#workon MISERY
declare -a SHEETS=('mets-misery-2018' 'mets-commentary-2018' 'mets-injured-list-2018')
for SHEET in ${SHEETS[@]}; do
    python3 publish.py --sheet=$SHEET
done

scp output/* qa:/apps/project/misery-index/output/

#!/bin/bash
workon MISERY
if [ -e source.bash ]; then source source.bash; fi
declare -a SHEETS=('mets-misery-2018' 'mets-commentary-2018' 'mets-injured-list-2018' 'yankee-derby-2018')
for SHEET in ${SHEETS[@]}; do
    python3 publish.py --sheet=$SHEET
done

if [ `whoami` = 'webadm' ]
then
	cp output/mets* /apps/project/misery-tracker/output/
	scp output/mets-* prod:/apps/project/misery-index/output/
	cp output/yankee* /apps/project/yankees-sluggers-tracker/output/
	scp output/yankee-derby-2018.json prod:/apps/project/yankees-sluggers-tracker/output/
else
	scp output/mets-* qa:/apps/project/misery-index/output/
	scp output/yankee-derby-2018.json qa:/apps/project/yankees-sluggers-tracker/output/
fi

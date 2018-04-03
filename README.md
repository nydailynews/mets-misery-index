# [Mets Misery Index](http://interactive.nydailynews.com/project/mets-misery-index/)

Inspired by and based on the [Denver Post’s Rockies Misery Index](https://github.com/denverpost/misery-index)

## Usage

### How to set up a dev environment
This is a python 3 app, make sure you have python 3 installed before continuing. `brew install python3` on a mac.

1. To create a virtual environment using python3, run something like `mkvirtualenv --python=/usr/local/bin/python3 MISERY`.
1. cd to the project root
1. `pip3 install -r requirements.txt`

If you don't have python 3 and virtualenv set up:
1. `brew install python3`
1. `pip3 install virtualenv`
1. `pip3 install virtualenvwrapper`
1. `VIRTUALENVWRAPPER_PYTHON=/usr/local/bin/python3`
1. `source /usr/local/bin/virtualenvwrapper.sh`


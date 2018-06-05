# [Mets Misery Index](http://interactive.nydailynews.com/project/mets-misery-index/)

Inspired by and based on the [Denver Post’s Rockies Misery Index](https://github.com/denverpost/misery-index)

## Production

### In-article widgets

Here's the new workflow for adding a Mets Misery Index widget to articles:

1. Go to https://github.com/nydailynews/mets-misery-index#in-article-widgets
2. That will take you to the part of the page where the markup is for each of the three widgets, misery-injury, misery-poll and misery-index. *Choose which one of those you want and triple-click the line with that markup.*
3. You should have the line with the markup selected now. Copy it to your clipboard.
4. In SNAP, in the article, create a new HTML embed. Paste the contents of your clipboard into the field. It should look something like this:

```html
<iframe id="misery-injury" scrolling="no" style="width: 100%; height: 310px; border: 0;" src="http://interactive.nydailynews.com/project/mets-misery-index/widget-injury-tracker.html"></iframe>

<iframe id="misery-poll" scrolling="no" style="width: 100%; height: 300px; border: 0;" src="http://interactive.nydailynews.com/project/mets-misery-index/widget-fan-misery.html"></iframe>

<iframe id="misery-index" scrolling="no" style="width: 100%; height: 190px; border: 0;" src="http://interactive.nydailynews.com/project/mets-misery-index/widget-misery.html"></iframe>

```


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

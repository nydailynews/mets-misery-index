#!/usr/bin/env python
# Class for writing the misery index json files
import os, sys
import argparse
from datetime import date, datetime, timedelta
import time
import math
from spreadsheet import Sheet
from collections import defaultdict, OrderedDict

class Injury:
    """ Publish the injury spreadsheet.
        """

    def __init__(self, sheet):
        self.sheet = sheet

class Commentary:
    """ Publish the commentary spreadsheet.
        """

    def __init__(self, sheet):
        self.sheet = sheet

class Misery:
    """ Publish the misery spreadsheet.
        """

    def __init__(self, sheet):
        self.sheet = sheet


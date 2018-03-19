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
        This is different from sheet.publish because we write two json files,
        one with the recent misery and then another with the per-day misery scores.
        """

    def __init__(self, sheet):
        self.sheet = sheet

    def build_score_list(self):
        pass

    def publish(self):
        pass

def main(args):
    """ Handle the command line.
        """
    sheet = Sheet('NYDN Sports', args.sheet)
    sheet.options = args
    sheet.rows = sheet.get_sheet_rows()
    sheet.rows = sheet.filter_mostly_blank_rows(sheet.rows)
    sheet.publish()

    # We want to build a list of per-day misery scores too
    if 'misery' in args.sheet:
        m = Misery(sheet)
        m.publish

def build_parser(args):
    """ Handle the argparse and make it testable.
        >>> args = build_parser(['--verbose'])
        >>> print(args.verbose)
        True
        """
    parser = argparse.ArgumentParser(usage = '$ python publish.py --sheet mets-misery-2018',
                                        description='''Downloads, filters and re-publishes a Google Sheet tab.''',
                                        epilog='')
    parser.add_argument('-v', '--verbose', dest='verbose', default=False, action='store_true')
    parser.add_argument('-t', '--test', dest='test', default=False, action='store_true')
    parser.add_argument('-s', '--sheet', dest='sheet', default=None)
    args = parser.parse_args(args)
    return args

if __name__ == '__main__':
    args = build_parser(sys.argv[1:])

    if args.test == True:
        doctest.testmod(verbose=args.verbose)

    main(args)

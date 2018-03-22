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
        """ Build a per-day list of misery scores, ala / cribbed liberally from https://github.com/denverpost/misery-index/blob/master/misery.py#L164
            We take a 
            A row is expected to look like
            ['2018-03-29', 'Mets start season with five players on the DL', '3', '']
            and gets turned into a dict that looks like
            {'date': '2018-04-09', 'event': 'Testy test testalot', 'misery-score': '1', 'url': ''}

            To do this we build a list of dates between today and the first day of the season.
            Then we loop through those dates and add any misery scores to them.
            Then we loop through those dates again and prolong the misery.
            """
        new_rows = []
        events = OrderedDict()
        dates = OrderedDict()
        today = date.today()
        print(today)
        
        for i, row in enumerate(self.sheet.rows):
            if i == 0:
                keys = row
                continue
            r = dict(zip(keys, row))
            if r['event'] == '':
                continue
            print(r)

    def publish(self):
        """ Build the modified misery list.
            """
        self.sheet.rows = self.build_score_list()
        self.sheet.publish()
        return True

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
        m.publish()

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

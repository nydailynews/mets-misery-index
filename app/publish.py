#!/usr/bin/env python
# Class for writing the misery index json files
import os, sys
import argparse
from datetime import date, datetime, timedelta
import time
import math
import json
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

    def date_obj_to_str(self, date_obj):
        """ Turn a date object into a string formatted like '2018-02-03'
            """
        return date_obj.__str__()

    def date_str_to_obj(self, date_str):
        """ Turn a '2018-02-03' string into a date object.
            """
        return datetime.strptime(date_str, '%Y-%m-%d').date()

    def build_score_list(self):
        """ Build a per-day list of misery scores, ala / cribbed liberally from https://github.com/denverpost/misery-index/blob/master/misery.py#L164
            We take a 
            A row is expected to look like
            ['2018-03-29', 'Mets start season with five players on the DL', '3', '']
            and gets turned into a dict that looks like
            {'date': '2018-04-09', 'event': 'Testy test testalot', 'misery-score': '1', 'url': ''}

            To do this we:
            1. Build a list of dicts we can use for our score calculations.
            2. Build a list of dates from the first day of the season until the latest day we have activity for or today, whichever is later.
            3. Then we loop through those dates and add any misery scores to them.
            4. Then we loop through those dates again and prolong the misery.
            """
        new_rows = []
        first_day = date.today()
        last_day = date.today()
        events = OrderedDict()
        dates = OrderedDict()
        scores = OrderedDict()
        today = date.today()
        print(today)
        
        # 1. Build a list of dicts we can use for our score calculations.
        for i, row in enumerate(self.sheet.rows):
            if i == 0:
                keys = row
                continue
            r = dict(zip(keys, row))
            if r['event'] == '':
                continue
            new_rows.append(r)
            d = self.date_str_to_obj(r['date'])
            if d < first_day:
                first_day = d
            if d > last_day:
                last_day = d
            print(r)

        # 2. Build a list of dates from the first day of the season until the latest day we have activity for or today, whichever is later.
        d = first_day
        while d < last_day:
            d_str = d.__str__()
            if d_str not in scores:
                # 4. Then we loop through those dates again and prolong the misery.
                # Check the previous day for any misery we should account for,
                # otherwise assign today's value a starting score of zero.
                yesterday = d - timedelta(1)
                if yesterday.__str__() in scores:
                    yesterdays_score = scores[yesterday.__str__()]['misery-score']
                    # We divide the previous day's misery score by 2 and round down to get the residual misery.
                    residual_misery = math.floor(yesterdays_score/float(2))
                    scores[d_str] = { 'misery-score': residual_misery }
                else:
                    scores[d_str] = { 'misery-score': 0 }

            # 3. Then we loop through those dates and add any misery scores to them.
            for item in new_rows:
                if item['date'] == d_str:
                    if item['misery-score'] == '':
                        continue
                    scores[d_str]['misery-score'] += int(item['misery-score'])
            d += timedelta(1)
        #print(json.dumps(scores))
        return scores

    def publish(self):
        """ Build the modified misery list.
            """
        self.sheet.rows = self.build_score_list()
        self.sheet.filename = 'mets-misery-daily-2018' #***HC
        self.sheet.publish_json_only()
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

#!/usr/bin/env python
# Class for interfacing with Google Sheets
import os
import gspread
from oauth2client.client import SignedJwtAssertionCredentials
import argparse
import csv
from collections import OrderedDict
import json
import doctest

class SheetDiff:
    """ Tell us if there's a difference between the sheet we're about to publish
        and the previous json file for that sheet that we wrote.
        """

    def __init__(self, prev):
        import filecmp
        self.prev = prev

    def check_diff(self, new):
        """ Given the path for the new json file, compare its contents against
            the previous.
            """
        shallow_compare = False
        if filecmp.cmp(self.prev, new, shallow_compare) == True:
            return ''

class Sheet:
    """ The interface for querying Google Sheets.
        >>> sheet = Sheet('test-sheet', 'worksheet-name')
        >>> sheet.publish()
        True
        """

    def __init__(self, sheet_name, worksheet=None):
        """ Create an object.
            >>> sheet = Sheet('test-sheet', 'worksheet-name')
            """
        self.options = None
        self.directory = os.path.dirname(os.path.realpath(__file__))
        if not os.path.isdir('%s/output' % self.directory):
            os.mkdir('%s/output' % self.directory)

        scope = ['https://spreadsheets.google.com/feeds']
        self.credentials = SignedJwtAssertionCredentials(
            os.environ.get('ACCOUNT_USER'),
            os.environ.get('ACCOUNT_KEY').replace("\\n", "\n"),
            scope)
        self.spread = gspread.authorize(self.credentials)
        self.sheet_name = sheet_name
        self.filters = None
        if worksheet:
            self.open_worksheet(worksheet)
            self.worksheet = worksheet

    def slugify(self, slug):
        return slug.lower().replace(' ', '-')

    def add_filter(self, key, value):
        """ Add a filter we will parse the spreadsheet by. Key should match
            a key in the spreadsheet (capitalization matters).
            >>> sheet = Sheet('test-sheet', 'worksheet-name')
            >>> sheet.add_filter('name', 'test')
            True
            >>> sheet.filters
            [{'value': 'test', 'key': 'name'}]
            """
        if self.filters:
            self.filters.append({'key': key, 'value': value})
        else:
            self.filters = [{'key': key, 'value': value}]
        return True

    def build_filename(self):
        """ Put together the name of the file we're writing. This is based
            on the worksheet name and any filters.
            >>> sheet = Sheet('test-sheet', 'worksheet-name')
            >>> sheet.add_filter('name', 'test')
            True
            >>> sheet.build_filename()
            True
            >>> sheet.filename
            'worksheet-name-test'
            """
        filter_string = ''
        if self.filters:
            filter_string += '-'
            for item in self.filters:
                filter_string += self.slugify(item['value'])

        self.filename = '%s%s' % (self.worksheet, filter_string)
        return True

    def open_worksheet(self, worksheet):
        """ Open a spreadsheet, return a sheet object.
            >>> sheet = Sheet('test-sheet')
            >>> sheet.open_worksheet('worksheet-name')
            <Worksheet 'worksheet-name' id:od6>
            """
        self.sheet = self.spread.open(self.sheet_name).worksheet(worksheet)
        return self.sheet

    def get_sheet_rows(self, worksheet=None):
        """ Return a list of each of the sheet's rows.
            >>> sheet = Sheet('test-sheet', 'worksheet-name')
            >>> sheet.get_sheet_rows()
            >>> print(rows[0])

            """
        if not self.sheet or worksheet:
            self.sheet = self.open_worksheet(worksheet)

        if not worksheet:
            worksheet = self.worksheet

        rows = self.sheet.get_all_values()
        return rows

    def filter_mostly_blank_rows(self, rows):
        """ Given a list of lists, go through each list.
            If only one field in that list is filled out, skip it.
            Returns a new list of rows.
            >>> sheet = Sheet('test-sheet', 'worksheet-name')
            >>> sheet.rows = sheet.get_sheet_rows()
            >>> sheet.rows = sheet.filter_mostly_blank_rows()
            """
        new_rows = []
        for row in rows:
            count = 0
            for i in row:
                if i != '':
                    count += 1
            if count > 1:
                new_rows.append(row)
        return new_rows

    def publish(self, worksheet=None):
        """ Publish the data in whatever permutations we need.
            This assumes the spreadsheet's key names are in the first row.
            This also assumes rows have already been set.
            >>> sheet = Sheet('test-sheet', 'worksheet-name')
            >>> sheet.rows = sheet.get_sheet_rows()
            >>> sheet.publish()
            True
            """
        if not self.sheet or worksheet:
            self.sheet = self.open_worksheet(worksheet)

        if not worksheet:
            worksheet = self.worksheet

        self.build_filename()
        rows = self.rows
        keys = rows[0]
        fn = {
            'json_check': open('%s/output/%s-check.json' % (self.directory, self.filename), 'w'),
            'json': open('%s/output/%s.json' % (self.directory, self.filename), 'w'),
            'csv': open('%s/output/%s.csv' % (self.directory, self.filename), 'w')
        }

        recordwriter = csv.DictWriter( fn['csv'], keys, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        recordwriter.writeheader()
        records = []
        for i, row in enumerate(rows):
            if i == 0:
                continue
            record = OrderedDict(zip(keys, row))
            recordwriter.writerow(record)
            records.append(record)

        if records:
            # Dump the record in the check file so we can diff it.
            #json.dump(records, fn['json_check'])
            #diff = SheetDiff('%s/output/%s.json' % (self.directory, self.filename))
            #diff.check_diff('%s/output/%s-check.json' % (self.directory, self.filename))

            json.dump(records, fn['json'])

        return True

    def publish_json_only(self):
        """ Assumes self.filename's already set.
            """
        fn = {
            'json': open('%s/output/%s.json' % (self.directory, self.filename), 'w'),
        }
        json.dump(self.rows, fn['json'])
        return True
        
def main(args):
    """ Take args as key=value pairs, pass them to the add_filter method.
        Example command:
        $ python spreadsheet.py date=2018-01-04
        """
    sheet = Sheet('NYDN Sports', 'mets-misery-2018')
    sheet.options = args
    sheet.rows = sheet.get_sheet_rows()
    sheet.rows = sheet.filter_mostly_blank_rows(sheet.rows)
    sheet.publish()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(usage='$ python spreadsheet.py',
                                     description='',
                                     epilog='')
    parser.add_argument("-v", "--verbose", dest="verbose", default=False, action="store_true")
    parser.add_argument("-t", "--test", dest="test", default=False, action="store_true")
    args = parser.parse_args()

    if args.test:
        doctest.testmod(verbose=args.verbose)

    main(args)

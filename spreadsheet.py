#!/usr/bin/env python
import gspread
from oauth2client.client import SignedJwtAssertionCredentials
import argparse

class Sheet:
    """ The interface for querying Google Sheets.
        >>> sheet = Sheet('test-sheet', 'worksheet-name')
        >>> sheet.publish()
        True
        """

    def __init__(self, sheet_name, worksheet=None)
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
            string.replace(os.environ.get('ACCOUNT_KEY'), "\\n", "\n"),
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

    def publish(self, worksheet=None):
        """ Publish the data in whatever permutations we need.
            This assumes the spreadsheet's key names are in the first row.
            >>> sheet = Sheet('test-sheet', 'worksheet-name')
            >>> sheet.publish()
            True
            """
        if not self.sheet or worksheet:
            self.sheet = self.open_worksheet(worksheet)

        if not worksheet:
            worksheet = self.worksheet

        self.build_filename()

        rows = self.sheet.get_all_values()
        keys = rows[0]
        fn = {
            'json': open('%s/output/%s.json' % (self.directory, self.filename), 'wb'),
            'csv': open('%s/output/%s.csv' % (self.directory, self.filename), 'wb')
        }
        recordwriter = csv.writer(
            fn['csv'], delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        records = []
        for i, row in enumerate(rows):
            if i == 0:
                keys = row
                recordwriter.writerow(keys)
                continue
            record = OrderedDict(zip(keys, row))
            recordwriter.writerow(row)
            records += [record]

        if records:
            json.dump(records, fn['json'])

        return True
        
def main(args):
    """ Take args as key=value pairs, pass them to the add_filter method.
        Example command:
        $ python spreadsheet.py date=2018-01-04
        """
    sheet = Sheet('Misery Index', 'responses')
    sheet.options = args
    sheet.publish()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(usage='$ python spreadsheet.py',
                                     description='',
                                     epilog='')
    parser.add_argument("-v", "--verbose", dest="verbose", default=False, action="store_true")
    args = parser.parse_args()

    if args.verbose:
        doctest.testmod(verbose=args.verbose)

    main(args)

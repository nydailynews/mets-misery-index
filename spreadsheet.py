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
        pass
        
def main(args):
    """ Take args as key=value pairs, pass them to the add_filter method.
        Example command:
        $ python spreadsheet.py date=2018-01-04
        """
    sheet = Sheet('Misery Index', 'responses')
    sheet.set_options(args)
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

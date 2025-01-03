import {CsvParser} from './csv';

describe('CsvParser.hasNext', () => {
    test('should return false for empty input', () => {
        const parser = new CsvParser('');

        expect(parser.hasNext()).toBe(false);
    });

    test('should return false after reading the single row of data', () => {
        const parser = new CsvParser('Count,Name,Edition');

        expect(parser.hasNext()).toBe(true);
        parser.nextRow();
        expect(parser.hasNext()).toBe(false);
    });

    test('should return false after reading multiple rows of data', () => {
        const parser = new CsvParser('Count,Name,Edition\n1,Forest,LEA\n2,Island,UST\n3,Swamp,DOM\n');

        expect(parser.hasNext()).toBe(true);
        parser.nextRow();
        expect(parser.hasNext()).toBe(true);
        parser.nextRow();
        expect(parser.hasNext()).toBe(true);
        parser.nextRow();
        expect(parser.hasNext()).toBe(true);
        parser.nextRow();
        expect(parser.hasNext()).toBe(false);
    });
});

describe('CsvParser.nextRow', () => {
    test('should return an empty array for the empty string', () => {
        const parser = new CsvParser('');

        expect(parser.hasNext()).toBe(false);
        expect(parser.nextRow()).toEqual([]);
    });

    test('should return multiple rows', () => {
        const parser = new CsvParser('Count,Name,Edition\n1,Forest,LEA\n2,Island,UST\n3,Swamp,DOM\n');

        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['Count', 'Name', 'Edition']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['1', 'Forest', 'LEA']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['2', 'Island', 'UST']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['3', 'Swamp', 'DOM']);
        expect(parser.hasNext()).toBe(false);
        expect(parser.nextRow()).toEqual([]);
    });

    test('should handle empty cells', () => {
        const parser = new CsvParser('Count,Name,Edition\n,,\n,,\n');

        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['Count', 'Name', 'Edition']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['', '', '']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['', '', '']);
        expect(parser.hasNext()).toBe(false);
        expect(parser.nextRow()).toEqual([]);
    });
    
    test('should handle quoted cells', () => {
        const parser = new CsvParser('Count,Name,Edition\n"123","Abdel Adrian, Gorion\'s Ward","Commander Legends: Battle for Baldur\'s Gate"\n"123","Abdel Adrian, Gorion\'s Ward","Commander Legends: Battle for Baldur\'s Gate"\n')

        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['Count', 'Name', 'Edition']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['123', "Abdel Adrian, Gorion's Ward", "Commander Legends: Battle for Baldur's Gate"]);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['123', "Abdel Adrian, Gorion's Ward", "Commander Legends: Battle for Baldur's Gate"]);
        expect(parser.hasNext()).toBe(false);
        expect(parser.nextRow()).toEqual([]);
    });

    test('should handle empty quoted cells', () => {
        const parser = new CsvParser('Count,Name,Edition\n"","",""\n"","",""\n')

        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['Count', 'Name', 'Edition']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['', '', '']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['', '', '']);
        expect(parser.hasNext()).toBe(false);
        expect(parser.nextRow()).toEqual([]);
    });

    test('should handle escaped quotes in quoted cells', () => {
        const parser = new CsvParser('Count,Name,Edition\n"""Brims"" Barone, Midway Mobster","""Lifetime"" Pass Holder","""Rumors of My Death . . ."""\n"""Brims"" Barone, Midway Mobster","""Lifetime"" Pass Holder","""Rumors of My Death . . ."""\n')

        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['Count', 'Name', 'Edition']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['"Brims" Barone, Midway Mobster', '"Lifetime" Pass Holder', '"Rumors of My Death . . ."']);
        expect(parser.hasNext()).toBe(true);
        expect(parser.nextRow()).toEqual(['"Brims" Barone, Midway Mobster', '"Lifetime" Pass Holder', '"Rumors of My Death . . ."']);
        expect(parser.hasNext()).toBe(false);
        expect(parser.nextRow()).toEqual([]);
    });
});

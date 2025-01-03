// I'm not sure why I started doing this instead of just writing a trivial CSV parser, but here we are
// https://digital-preservation.github.io/csv-schema/csv-schema-1.0.html

export type CsvSchema = {
    version: '1.0';

    separator: string;
    requireQuotes: true;

    

    columns: CsvColumn;
}

export type CsvColumn = {
    name: string;
    rules: CsvRule[];
}

export type CsvRule =
    CsvRuleNotEmpty |
    CsvRuleRange |
    CsvRuleIs;

export type CsvRuleNotEmpty = {rule: 'notEmpty'};
export type CsvRuleRange = {rule: 'range', min: number, max: number};
export type CsvRuleIs = {rule: 'is', value: string};

export function parseCsvSchema(input: string): CsvSchema {
    let remaining = input;

    function getNextNonWhitespace() {
        const match = /\S/.exec(remaining);
        return match?.index ?? remaining.length;
    }

    function advanceNextNonWhitespace() {
        remaining = remaining.substring(getNextNonWhitespace());
    }

    function peekCharacter() {
        return remaining.charAt(0);
    }

    function readField() {

    }

    function readLine() {
        let [line, rest] = remaining.split('\n', 2);
        remaining = rest ?? '';
        return line;
    }

    let versionLine = readLine();
    if (versionLine !== 'version 1.0') {
        throw new Error('invalid version line: ' + versionLine);
    }

    advanceNextNonWhitespace();



}
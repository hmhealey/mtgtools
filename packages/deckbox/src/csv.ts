const cellPattern = /^"((?:[^"]|"")*)",?/;

export class CsvParser {
    private readonly data: string;
    private index: number;

    constructor(data: string) {
        this.data = data;
        this.index = 0;
    }

    public hasNext(): boolean {
        return this.index < this.data.length;
    }

    public nextRow(): string[] {
        while (this.data[this.index] === '\n') {
            this.index += 1;
        }

        if (!this.hasNext()) {
            return [];
        }

        // console.log('reading row from `' + this.data.substring(this.index) + '`');

        const cells = [];

        while (true) {
            let cell;
            if (this.data[this.index] === '"') {
                cell = this.nextQuotedCell();
            } else {
                cell = this.nextUnquotedCell();
            }

            cells.push(cell);

            if (this.data[this.index] === ',') {
                this.index += 1;
                continue;
            } else if (this.data[this.index] === '\n') {
                this.index += 1;
                break;
            } else if (this.data[this.index] === undefined) {
                // console.log('read end of file');
                break;
            } else {
                throw new Error('read unexpected character ' + this.data[this.index] + ' after finishing reading cell');
            }
        }

        return cells;

        // const eol = this.data.indexOf('\n', this.index);
        // console.log('got newline after ' + this.index + ' at ' + eol);
        
        // if (eol === 0) {
        //     throw new Error('empty line');
        // }

        // let cells = [];

        // while (true) {
        //     const cellStart = this.index;

        //     let readLastCell = false;
        //     if (this.index >= eol) {
        //         readLastCell = true;
        //     }

        //     console.log('reading cell');
        //     let cell;
        //     if (this.data.charAt(this.index) === '"') {
        //         console.log('matching quoted');
        //         const cellMatch = cellPattern.exec(this.data.substring(this.index, eol));
        //         if (!cellMatch) {
        //             throw new Error('Unmatched double quote: ' + this.data.substring(this.index, eol));
        //         }

        //         cell = unescapeQuotes(cellMatch[1]);
        //         console.log('matched quoted ' + cell + ' and incrementing index by ' + cellMatch[0].length);
        //         this.index += cellMatch[0].length;
        //     } else {
        //         console.log('matching unquoted');
        //         let comma = this.data.indexOf(',', this.index);
        //         console.log('found comma at ' + comma + ' for ' + this.index);
        //         if (comma === -1) {
        //             readLastCell = true;
        //             comma = eol;
        //         }

        //         cell = this.data.substring(this.index, comma);
        //         console.log('matched unquoted `' + cell + '` and incrementing index by ' + (cell.length + 1));
        //         this.index += cell.length + 1;
        //     }
            
        //     console.log('read `' + this.data.substring(cellStart, this.index) + '`');

        //     cells.push(cell);

        //     if (readLastCell) {
        //         console.log('eol for cells');
        //         break;
        //     }
        // }
        // console.log('read row', cells);

        // return cells;
    }

    private nextUnquotedCell(): string {
        const startIndex = this.index;

        while (true) {
            const c = this.data[this.index];

            if (c === ',' || c === '\n' || c === undefined) {
                break;
            }

            this.index += 1;
        }

        return this.data.substring(startIndex, this.index);
    }

    private nextQuotedCell(): string {
        this.index += 1;

        const startIndex = this.index;

        while (true) {
            const c = this.data[this.index];

            if (c === undefined) {
                throw new Error('unexpected unmatched quote');
            }

            if (c === '"') {
                if (this.data[this.index + 1] === '"') {
                    this.index += 2;
                } else {
                    this.index += 1;
                    break;
                }
            } else {
                this.index += 1;
            }
        }

        return unescapeQuotes(this.data.substring(startIndex, this.index - 1));
    }
}

export function unescapeQuotes(val: string) {
    return val.replace(/""/g, '"');
}

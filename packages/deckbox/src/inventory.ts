import {CsvParser} from './csv';

// export class Inventory {

//     getCount(scryfallId: string, foil?: boolean) {
//         return -1;
//     }

//     static fromCsv(csvData: string) {
//         const parser = new CsvParser(csvData);
//         const header = parser.nextRow();
//     }
// }

export enum Condition {
    NearMint = 'Near Mint',
    LightlyPlayed = 'Good (Lightly Played)',
    Played = 'Played',
    HeavilyPlayed = 'Heavily Played',
    Damaged = 'Poor',
    None = '',
}

export class InventoryParser {
    private parser: CsvParser;

    private readonly countIndex: number;
    private readonly tradelistCountIndex: number;
    private readonly nameIndex: number;
    private readonly editionIndex: number;
    private readonly editionCodeIndex: number;
    private readonly cardNumberIndex: number;
    private readonly conditionIndex: number;
    private readonly languageIndex: number;
    private readonly foilIndex: number;
    private readonly signedIndex: number;
    private readonly artistProofIndex: number;
    private readonly alteredIndex: number;
    private readonly misprintIndex: number;
    private readonly promoIndex: number;
    private readonly textlessIndex: number;
    private readonly printingIdIndex: number;
    private readonly printingNoteIndex: number;
    private readonly tagsIndex: number;
    private readonly myPriceIndex: number;
    private readonly lastUpdatedIndex: number;
    private readonly scryfallIdIndex: number;

    constructor(csvData: string) {
        this.parser = new CsvParser(csvData);

        const header = this.parser.nextRow();

        this.countIndex = header.indexOf('Count');
        this.tradelistCountIndex = header.indexOf('Tradelist Count');
        this.nameIndex = header.indexOf('Name');
        this.editionIndex = header.indexOf('Edition');
        this.editionCodeIndex = header.indexOf('Edition Code');
        this.cardNumberIndex = header.indexOf('Card Number');
        this.conditionIndex = header.indexOf('Condition');
        this.languageIndex = header.indexOf('Language');
        this.foilIndex = header.indexOf('Foil');
        this.signedIndex = header.indexOf('Signed');
        this.artistProofIndex = header.indexOf('Artist Proof');
        this.alteredIndex = header.indexOf('Altered Art');
        this.misprintIndex = header.indexOf('Misprint');
        this.promoIndex = header.indexOf('Promo');
        this.textlessIndex = header.indexOf('Textless');
        this.printingIdIndex = header.indexOf('Printing Id');
        this.printingNoteIndex = header.indexOf('Printing Note');
        this.tagsIndex = header.indexOf('Tags');
        this.myPriceIndex = header.indexOf('My Price');
        this.lastUpdatedIndex = header.indexOf('Last Updated');
        this.scryfallIdIndex = header.indexOf('Scryfall ID');

        if (
            this.countIndex === -1 ||
            this.tradelistCountIndex === -1 ||
            this.nameIndex === -1 ||
            this.editionIndex === -1 ||
            this.editionCodeIndex === -1 ||
            this.cardNumberIndex === -1 ||
            this.conditionIndex === -1 ||
            this.languageIndex === -1 ||
            this.foilIndex === -1 ||
            this.signedIndex === -1 ||
            this.artistProofIndex === -1 ||
            this.alteredIndex === -1 ||
            this.misprintIndex === -1 ||
            this.promoIndex === -1 ||
            this.textlessIndex === -1 ||
            this.printingIdIndex === -1 ||
            this.printingNoteIndex === -1 ||
            this.tagsIndex === -1 ||
            this.myPriceIndex === -1 ||
            this.lastUpdatedIndex === -1 ||
            this.scryfallIdIndex === -1
        ) {
            throw new Error('Missing column: ' + JSON.stringify({...this, parser: undefined}));
        }
    }

    public hasNext(): boolean {
        return this.parser.hasNext();
    }

    public readRow(): InventoryRow | null {
        if (!this.parser.hasNext()) {
            return null;
        }

        const cells = this.parser.nextRow();
        
        if (cells.length === 0) {
            return null;
        } else if (cells.length !== 21) {
            throw new Error('Incorrect number of columns' + cells.length + JSON.stringify(cells));
        }

        return {
            count: parseInt(cells[this.countIndex], 10),
            tradelistCount: parseInt(cells[this.tradelistCountIndex], 10),
            name: cells[this.nameIndex],
            edition: cells[this.editionIndex],
            editionCode: cells[this.editionCodeIndex],
            cardNumber: cells[this.cardNumberIndex],
            condition: Object.hasOwn(Condition, cells[this.conditionIndex]) ? Condition[cells[this.conditionIndex] as keyof typeof Condition] : Condition.None,
            language: cells[this.languageIndex],
            foil: cells[this.foilIndex] === 'foil',
            signed: cells[this.signedIndex] === 'signed',
            artistProof: cells[this.artistProofIndex] === 'artist proof', // This is untested
            altered: cells[this.alteredIndex] === 'altered',
            misprint: cells[this.misprintIndex] === 'misprint',
            promo: cells[this.promoIndex] === 'promo',
            textless: cells[this.textlessIndex] === 'textless', // This is untested
            printingId: cells[this.printingIdIndex],
            printingNote: cells[this.printingNoteIndex],
            tags: cells[this.tagsIndex],
            myPrice: cells[this.myPriceIndex],
            lastUpdated: new Date(cells[this.lastUpdatedIndex]).getTime(),
            scryfallId: cells[this.scryfallIdIndex],
        };
    }
}

export type InventoryRow = {
    count: number;
    tradelistCount: number;
    name: string;
    edition: string;
    editionCode: string;
    cardNumber: string;
    condition: Condition;
    language: string;
    foil: boolean;
    signed: boolean;
    artistProof: boolean;
    altered: boolean;
    misprint: boolean;
    promo: boolean;
    textless: boolean;
    printingId: string;
    printingNote: string;
    tags: string;
    myPrice: string;
    lastUpdated: number;
    scryfallId: string;
}

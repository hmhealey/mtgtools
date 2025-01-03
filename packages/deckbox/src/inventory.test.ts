import fs from 'node:fs';

import {InventoryParser, InventoryRow} from './inventory';

test('aa', () => {
    const csvData = fs.readFileSync('../../inventory_esplode_2024.October.22.csv', {encoding: 'utf-8'});

    const parser = new InventoryParser(csvData);
    const rows: InventoryRow[] = [];

    const uniqueValues = new Set();
    while (parser.hasNext()) {
        const row = parser.readRow();
        if (!row) {
            continue;
        }

        const value = row.lastUpdated;
        uniqueValues.add(value);

        rows.push(row);
    }

    let output = '[\n';
    for (const uniqueValue of uniqueValues) {
        output += '  ' + JSON.stringify(uniqueValue) + ',\n';
    }
    output += ']';
    console.log(output);

    // for (const row of rows) {
    //     if (row.lastUpdated === '') {
    //         console.log('row', row);
    //     }
    // }
});

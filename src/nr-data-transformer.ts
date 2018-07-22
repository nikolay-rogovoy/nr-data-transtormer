/***/
import {INullFunc} from "./i-null-func";
import {IGroupedRow} from "./i-grouped-row";

export class NrDataTransformer<T> {
    /***/
    constructor(private nullFunc: INullFunc<T>) {
    }
    /***/
    public groupByTransformer(fields: string[], rows: T[]): IGroupedRow<T>[] {
        if (fields.length) {
            let fieldToGroupBy = fields.shift();
            let groupedRows = this.groupBy(fieldToGroupBy, rows);
            if (fields.length) {
                for (let groupItem of groupedRows) {
                    groupItem.items = this.groupByTransformer(fields, rows);
                }
            }
            return groupedRows;
        } else {
            throw new Error('No fields to group');
        }
    }
    /***/
    private groupBy(key: string, sourceArray: T[]): IGroupedRow<T>[] {
        let getValue = (val, key) => val[key] ? val[key] : this.nullFunc(val, key);
        let groupObject = sourceArray.reduce((acc, val) => {
            (acc[getValue(val, key)] = acc[getValue(val, key)] || []).push(val);
            return acc;
        }, {});
        return Object.keys(groupObject).map(x => {
            return {value: x, items: groupObject[x]}
        });
    }
}
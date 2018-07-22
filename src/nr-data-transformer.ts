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
                    groupItem.items = this.groupByTransformer([...fields], <T[]>groupItem.items);
                }
            }
            return groupedRows;
        } else {
            throw new Error('No fields to group');
        }
    }
    /***/
    private groupBy(key: string, sourceArray: T[]): IGroupedRow<T>[] {
        let getValue = (val: T, key: string) => {
            let value = this.extractDataFromObject(val, key);
            return value ? value : this.nullFunc(val, key);
        };
        let groupObject = sourceArray.reduce((acc, val) => {
            (acc[getValue(val, key)] = acc[getValue(val, key)] || []).push(val);
            return acc;
        }, {});
        return Object.keys(groupObject).map(x => {
            return {value: x, items: groupObject[x]}
        });
    }
    /***/
    private extractDataFromObject(obj: Object, path: string): any {
        let regExp = /^(\w*)\./gm;
        let result = regExp.exec(path);
        if (result) {
            let newPath = path.replace(regExp, '');
            if (obj.hasOwnProperty(result[1])) {
                return this.extractDataFromObject(obj[result[1]], newPath);
            } else {
                throw Error('Не найдено свойство ' + result[1]);
            }
        } else {
            if (obj.hasOwnProperty(path)) {
                return obj[path];
            } else {
                throw Error('Не найдено свойство ' + path);
            }
        }
    }
}

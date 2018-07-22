/***/
export interface IGroupedRow<T> {
    /***/
    value: any;
    /***/
    items: T[] | IGroupedRow<T>[];
}

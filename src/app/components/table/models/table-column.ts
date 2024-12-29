export interface TableColumn {
    label: string;
    def: string;
    datakey: string;
    formatt?: string;
    dataType?: 'date' | 'object';
}

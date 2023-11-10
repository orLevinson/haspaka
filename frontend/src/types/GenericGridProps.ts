import { ColDef } from "ag-grid-community";
import { unit } from "./unit";

interface GenericGridProps {
    title: string;
    columnDefs: ColDef[];
    type: string;
    isReadonly?: boolean;
    selectedUnit?: unit;
    setSelectedUnit?: any;
}

export type { GenericGridProps };
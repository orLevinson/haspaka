import { ColDef } from "ag-grid-community";
import { unit } from "./unit";

interface GenericGridProps {
  title: string;
  columnDefs: ColDef[];
  type: string;
  isTableWithUnitFiltering?: boolean;
  selectedUnit?: unit;
  setSelectedUnit?: any;
  noAddOrDelete?: boolean;
}

export type { GenericGridProps };

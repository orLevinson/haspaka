import { ColDef } from "ag-grid-community";
import { unit } from "./unit";
import { command } from "./command";
import { ReactElement } from "react";

interface GenericGridProps {
  title: string;
  columnDefs: ColDef[];
  type: string;
  isTableWithFiltering?: boolean;
  selected?: unit | command;
  setSelected?: any;
  noAddButton?: boolean;
  noDeleteButton?: boolean;
  filtering?: string;
  description?: ReactElement;
}

export type { GenericGridProps };

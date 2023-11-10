import { useState } from "react";
import { ColDef, ISelectCellEditorParams } from "ag-grid-community";
import GenericGrid from "../components/GenericGrid";
import useCheckPermission from "../shared/useCheckPermission";

const Items = () => {
  useCheckPermission({ permission: "admins" });
  const [columnDefs, _setColumnDefs] = useState<ColDef[]>([
    { field: "item_id", hide: true },
    { field: "item_name", headerName: "שם הפריט", filter: true },
    {
      field: "item_type",
      headerName: "סוג הפריט",
      cellEditor: "agSelectCellEditor",
      filter: "agSetColumnFilter",
      cellEditorParams: {
        values: ["שהייה", "חורף"],
      } as ISelectCellEditorParams,
    },
  ]);

  return (
    <GenericGrid type="items" title="הגדרת פריטים" columnDefs={columnDefs} />
  );
};

export default Items;

import { useState } from "react";
import GenericGrid from "../components/GenericGrid";
import { ColDef } from "ag-grid-community";

const Commands = () => {
  const [columnDefs, _setColumnDefs] = useState<ColDef[]>([
    { field: "command_id", headerName: "מזהה", hide: true },
    { field: "command_name", headerName: "שם הפיקוד", filter: true },
  ]);

  return (
    <GenericGrid
      title="הגדרת פיקודים"
      type="commands"
      columnDefs={columnDefs}
    />
  );
};

export default Commands;

import { ColDef } from "ag-grid-community";
import { useContext, useEffect, useState } from "react";
import GenericGrid from "../components/GenericGrid";
import { UserCtx } from "../shared/userCtx";
import { unit } from "../types/unit";

const TableWithUnitFiltering = (props: {
  type: string;
  title: string;
  onlyAdminsCanEdit?: boolean;
}) => {
  const { userData } = useContext(UserCtx);
  const { command_name } = userData;
  const [selectedUnit, setSelectedUnit] = useState<unit | undefined>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "unit_name",
      headerName: "אוגדה",
      filter: true,
      editable: false,
      sort: "asc",
    },
    {
      field: "item_name",
      headerName: "פריט",
      filter: true,
      editable: false,
      sort: "asc",
    },
    {
      field: "value",
      headerName: "כמות",
      filter: true,
      editable: props.onlyAdminsCanEdit ? command_name == "מנהלים" : true,
    },
  ]);

  useEffect(() => {
    setColumnDefs([
      {
        field: "unit_name",
        headerName: "אוגדה",
        filter: true,
        editable: false,
        sort: "asc",
      },
      {
        field: "item_name",
        headerName: "פריט",
        filter: true,
        editable: false,
        sort: "asc",
      },
      {
        field: "value",
        headerName: "כמות",
        filter: true,
        editable: props.onlyAdminsCanEdit ? command_name == "מנהלים" : true,
      },
    ]);
  }, [command_name, props]);

  return (
    <div className="flex flex-col items-center w-full">
      <GenericGrid
        type={props.type}
        title={props.title}
        columnDefs={columnDefs}
        isTableWithUnitFiltering={true}
        noAddButton={true}
        noDeleteButton={true}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
      />
    </div>
  );
};

export default TableWithUnitFiltering;

import { ColDef } from "ag-grid-community";
import { ReactElement, useContext, useEffect, useState } from "react";
import GenericGrid from "./GenericGrid";
import { UserCtx } from "../shared/userCtx";
import { unit } from "../types/unit";
import { command } from "../types/command";

const TableWithFiltering = (props: {
  type: string;
  title: string;
  filtering: string;
  onlyAdminsCanEdit?: boolean;
  decription: ReactElement;
}) => {

  const { userData } = useContext(UserCtx);
  const { command_name } = userData;
  const [selected, setSelected] = useState<command | unit | undefined>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  useEffect(() => {
    setColumnDefs([
      {
        field: 'date',
        headerName: 'עדכון אחרון',
        filter: true,
        editable: false,
        cellStyle: params =>
          (new Date().getTime() - new Date(params.value).getTime()) <= 60 * 60 * 24 * 1000
            ? { color: 'black' }
            : { color: 'rgba(200, 0, 0)' }
        ,
        cellRenderer: (data: any) =>
          data.value
            ? new Date(data.value).toLocaleDateString("en-IL", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
            : "",
      },
      {
        field: props.filtering === 'units' ? "unit_name" : "command_name",
        headerName: props.filtering === 'units' ? "אוגדה" : 'פיקוד',
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
        isTableWithFiltering={true}
        noAddButton={true}
        noDeleteButton={true}
        selected={selected}
        setSelected={setSelected}
        filtering={props.filtering}
        description={props.decription}
      />
    </div>
  );
};

export default TableWithFiltering;

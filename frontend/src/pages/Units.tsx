import { useContext, useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useQuery } from "react-query";
import axios from "axios";
import { command } from "../types/command";
import { ColDef, ISelectCellEditorParams } from "ag-grid-community";
import GenericGrid from "../components/GenericGrid";
import { UserCtx } from "../shared/userCtx";
import useCheckPermission from "../shared/useCheckPermission";

const Units = () => {
  const { userData } = useContext(UserCtx);
  useCheckPermission({ permission: "admins" });

  const commandsQuery = useQuery<command[]>(
    "commands",
    () =>
      axios
        .get(import.meta.env.VITE_REACT_APP_BASE_URL + "/commands", {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
        .then((res) => res.data.body),
    { enabled: userData.token !== undefined }
  );

  const [commandMappings, setCommandMappings] = useState<{
    [key: number]: string;
  }>({});
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  useEffect(() => {
    if (commandsQuery.data) {
      const c: { [x: number]: string } = {};
      commandsQuery.data.forEach((command) => {
        c[command.command_id] = command.command_name;
      });
      setCommandMappings(c);
    }
  }, [commandsQuery]);

  useEffect(() => {
    setColumnDefs([
      {
        field: "unit_id",
        headerName: "מזהה",
        filter: true,
        editable: false,
        hide: true,
      },
      { field: "unit_name", headerName: "שם האוגדה", filter: true },
      {
        field: "command_id",
        headerName: "פיקוד",
        cellEditor: "agSelectCellEditor",
        filter: "agSetColumnFilter",
        cellEditorParams: {
          values: Object.keys(commandMappings),
        } as ISelectCellEditorParams,
        refData: commandMappings,
      },
    ]);
  }, [commandMappings, setColumnDefs]);

  return (
    <GenericGrid type="units" title="הגדרת אוגדות" columnDefs={columnDefs} />
  );
};

export default Units;

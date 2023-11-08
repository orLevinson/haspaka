import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useQuery } from "react-query";
import axios from "axios";
import { unit } from "../types/unit";
import { command } from "../types/command";
import { ColDef } from "ag-grid-community";
import GenericGrid from "../components/GenericGrid";

const Units = () => {

    const commandsQuery = useQuery<command[]>('commands', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/commands").then(res => res.json())
    );

    const [commandMappings, setCommandMappings] = useState<{ [key: number]: string }>({});
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

    useEffect(() => {
        if (commandsQuery.data) {
            const c = {};
            commandsQuery.data.forEach(command => {
                c[command.command_id] = command.command_name;
            });
            setCommandMappings(c);
        }
    }, [commandsQuery.data]);

    useEffect(() => {
        setColumnDefs([
            { field: 'unit_id', headerName: 'מזהה', filter: true, editable: false, hide: true },
            { field: 'unit_name', headerName: 'שם האוגדה', filter: true },
            {
                field: 'command_id',
                headerName: 'פיקוד',
                cellEditor: 'agSelectCellEditor',
                filter: 'agSetColumnFilter',
                cellEditorParams: {
                    values: Object.keys(commandMappings)
                } as ISelectCellEditorParams,
                refData: commandMappings,
            }
        ]);
    }, [commandMappings])

    return (
        <GenericGrid
            type="units"
            title="הגדרת אוגדות"
            columnDefs={columnDefs}
        />
    )
}

export default Units;
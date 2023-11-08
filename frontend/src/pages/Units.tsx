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

    const unitsQuery = useQuery<unit[]>('units', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/units").then(res => res.json())
    );

    const commandsQuery = useQuery<command[]>('commands', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/commands").then(res => res.json())
    );

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState<unit[]>([]); // Set rowData to Array of Objects, one Object per Row
    const [commandMappings, setCommandMappings] = useState<{ [key: number]: string }>({});
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const [selectedRows, setSelectedRows] = useState<unit[]>([]);

    useEffect(() => {
        if (unitsQuery.data) setRowData(unitsQuery.data);
    }, [unitsQuery.data]);

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

    const handleChange = e => {
        const copy = structuredClone(e.data);
        updateUnit(copy);
    }

    const handleAdd = () => {
        const newItem = { unit_name: 'אוגדה', command_id: Object.keys(commandMappings)[0] };
        addUnit(newItem);
    }

    const handleRemove = () => {
        const ids = selectedRows.map(unit => unit.unit_id);
        removeUnits(ids.toString());
    }

    const updateUnit = unit => axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + "/updateUnit", unit)
        .then(res => unitsQuery.refetch())
        .catch(err => console.error(err));

    const addUnit = unit => axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + "/addUnit", unit)
        .then(res => unitsQuery.refetch())
        .catch(err => console.error(err));

    const removeUnits = (ids: string) => axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + "/removeUnits", { ids })
        .then(res => unitsQuery.refetch())
        .catch(err => console.error(err));

    return (
        <GenericGrid
            title="הגדרת אוגדות"
            handleAdd={handleAdd}
            handleRemove={handleRemove}
            handleChange={handleChange}
            columnDefs={columnDefs}
            rowData={rowData}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            gridRef={gridRef}
        />
    )
}

export default Units;
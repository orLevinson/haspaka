import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { command } from "../types/command";
import axios from "axios";
import GenericGrid from "../components/GenericGrid";

const Commands = () => {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState<unit[]>([]); // Set rowData to Array of Objects, one Object per Row
    const [selectedRows, setSelectedRows] = useState<unit[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'command_id', headerName: 'מזהה', filter: true, editable: false, hide: true },
        { field: 'command_name', headerName: 'שם הפיקוד', filter: true },
    ]);

    const commandsQuery = useQuery('commands', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/commands").then(res => res.json())
    );

    useEffect(() => {
        if (commandsQuery.data) setRowData(commandsQuery.data);
    }, [commandsQuery.data]);

    const handleChange = e => {
        const copy = structuredClone(e.data);
        updateCommand(copy);
    }

    const handleRemove = () => {
        const ids = selectedRows.map(command => command.command_id);
        removeCommands(ids.toString());
    }

    const handleAdd = () => axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + "/addCommand")
        .then(res => commandsQuery.refetch())
        .catch(err => console.error(err));

    const removeCommands = (ids: string) => axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + "/removeCommands", { ids })
        .then(res => commandsQuery.refetch())
        .catch(err => console.error(err));

    return (
        <GenericGrid
            title="הגדרת פיקודים"
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

export default Commands;
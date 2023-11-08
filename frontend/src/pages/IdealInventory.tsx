import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import GenericGrid from "../components/GenericGrid";

const IdealInventory = () => {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState<unit[]>([]); // Set rowData to Array of Objects, one Object per Row
    const [selectedRows, setSelectedRows] = useState<unit[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'item_id', headerName: 'פריט', filter: true },
        { field: 'unit_id', headerName: 'אוגדה', filter: true },
        { field: 'value', headerName: 'כמות', filter: true },
    ]);

    const idealInventoryQuery = useQuery('idealInventory', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/idealInventory").then(res => res.json())
    );

    useEffect(() => {
        if (idealInventoryQuery.data) setRowData(idealInventoryQuery.data);
    }, [idealInventoryQuery.data]);

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
            title="תקן מודל"
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

export default IdealInventory;
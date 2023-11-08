import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";

const Commands = () => {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState<unit[]>([]); // Set rowData to Array of Objects, one Object per Row
    // const [commandMappings, setCommandMappings] = useState<{ [key: number]: string }>({});
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

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(() => ({
        sortable: true,
        flex: 1,
        editable: true
    }));

    // Example of consuming Grid Event
    const cellClickedListener = useCallback(event => {
        setSelectedRows(gridRef.current!.api.getSelectedRows());
    }, []);

    // Example using Grid's API
    const buttonListener = useCallback(e => {
        gridRef.current.api.deselectAll();
    }, []);

    const handleChange = e => {
        const copy = structuredClone(e.data);
        updateCommand(copy);
    }

    const handleAdd = () => {

    }

    return (
        <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between w-[50%] mx-auto">
                <span className="flex gap-4">
                    <button onClick={handleAdd} className="bg-teal-700 hover:bg-teal-600 text-white py-2 px-4 rounded-md shadow">הוסף</button>
                    {0 < selectedRows.length && <button onClick={handleRemove} className="bg-red-500 hover:bg-red-400 py-2 px-4 text-white rounded-md shadow">מחק</button>}
                </span>
                <span>הגדרת פיקודים</span>
            </div>

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine mx-auto" style={{ width: '50%', height: 500 }}>

                <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API
                    enableRtl={true}
                    rowData={rowData} // Row Data for Rows
                    onCellValueChanged={handleChange}
                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
                    enableCellChangeFlash={true}
                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                    rowSelection='multiple' // Options - allows click selection of rows

                    onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                />
            </div>
        </div>
    );
}

export default Commands;
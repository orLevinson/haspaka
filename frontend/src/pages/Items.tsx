import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useQuery } from "react-query";
import axios from "axios";
import { ColDef } from "ag-grid-community";
import { item } from "../types/item";

const Items = () => {

    const itemsQuery = useQuery<item[]>('items', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/items").then(res => res.json())
    );

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState<unit[]>([]); // Set rowData to Array of Objects, one Object per Row
    const [commandMappings, setCommandMappings] = useState<{ [key: number]: string }>({});
    const [selectedRows, setSelectedRows] = useState<unit[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'item_id', hide: true },
        { field: 'item_name', headerName: 'שם הפריט', filter: true },
        {
            field: 'item_type',
            headerName: 'סוג הפריט',
            cellEditor: 'agSelectCellEditor',
            filter: 'agSetColumnFilter',
            cellEditorParams: {
                values: ['שהייה', 'חורף']
            } as ISelectCellEditorParams,
        }
    ]);

    useEffect(() => {
        if (itemsQuery.data) setRowData(itemsQuery.data);
    }, [itemsQuery.data]);

    useEffect(() => {

    }, []);

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
        updateItem(copy);
    }

    const handleAdd = () => axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + "/addItem")
        .then(res => itemsQuery.refetch())
        .catch(err => console.error(err));

    const handleRemove = () => {
        const ids: string[] = selectedRows.map(item => item.item_id);
        removeItems(ids.toString());
    }

    const updateItem = (item: item) => axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + "/updateItem", item)
        .then(res => itemsQuery.refetch())
        .catch(err => console.error(err));

    const removeItems = (ids: string) => axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + "/removeItems", { ids })
        .then(res => itemsQuery.refetch())
        .catch(err => console.error(err));

    return (
        <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between w-[80%] mx-auto">
                <span className="flex gap-4">
                    <button onClick={handleAdd} className="bg-teal-700 hover:bg-teal-600 text-white py-2 px-4 rounded-md shadow">הוסף</button>
                    {0 < selectedRows.length && <button onClick={handleRemove} className="bg-red-500 hover:bg-red-400 py-2 px-4 text-white rounded-md shadow">מחק</button>}
                </span>
                <span>הגדרת פריטים</span>
            </div>

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine mx-auto w-[80%] h-[70vh] shadow-lg">

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

export default Items;
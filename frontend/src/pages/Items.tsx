import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useQuery } from "react-query";
import axios from "axios";
import { ColDef } from "ag-grid-community";
import { item } from "../types/item";
import GenericGrid from "../components/GenericGrid";

const Items = () => {

    const itemsQuery = useQuery<item[]>('items', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/items").then(res => res.json())
    );

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState<unit[]>([]); // Set rowData to Array of Objects, one Object per Row
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
        <GenericGrid
            title="הגדרת פריטים"
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

export default Items;
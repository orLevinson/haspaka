import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { inventory } from "../types/inventory";
import { item } from "../types/item";
import { ColDef } from "ag-grid-community";

const MarhasInventory = () => {

    const itemsQuery = useQuery<item[]>('items', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/items").then(res => res.json())
    );

    const gridRef = useRef();
    const [itemMappings, setItemMappings] = useState<{ [key: number]: string }>({});
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'date', headerName: 'תאריך', filter: true, editable: false, },
        { field: 'item_id', headerName: 'פריט', filter: true, editable: false, },
        { field: 'value', headerName: 'כמות', filter: true, editable: false, },

    ]);
    const [rowData, setRowData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const url = `${import.meta.env.VITE_REACT_APP_BASE_URL}/marhasInventory`;

    const query = useQuery<inventory[]>('marhasInventory', () => fetch(url).then(res => res.json()));

    useEffect(() => {
        if (itemsQuery.data) {
            const c = {};
            itemsQuery.data.forEach(item => {
                c[item.item_id] = item.item_name;
            });
            setItemMappings(c);
            const colDefs = [{ field: 'date', headerName: 'תאריך' }].concat(
                itemsQuery.data.map((i: item) => ({
                    field: i.item_id.toString(),
                    headerName: i.item_name,
                    valueFormatter: (params) => !params.value ? 0 : params.value
                }))
            );
            setColumnDefs(colDefs);
        }
    }, [itemsQuery.data]);

    useEffect(() => {
        if (query.data) {
            const rows = [];
            const dates: { [id: Date]: { [id: Number]: number } } = {};
            query.data.forEach((i: inventory) => {
                const date = new Date(i.date);
                const pair = {};
                dates[date] = { ...dates[date], [i.item_id]: i.value };
            });
            setRowData(Object.keys(dates).map(date => ({ ...dates[date], date: new Date(date) })));
        }
    }, [query.data]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        flex: 1,
        editable: true
    }));

    const cellClickedListener = useCallback(event => {
        setSelectedRows(gridRef.current!.api.getSelectedRows());
    }, []);

    const handleChange = e => {
        const copy = structuredClone(e.data);
        console.log(e.data);
        // update(copy);
    }

    const handleRemove = () => {

    }

    return (
        <div className="flex flex-col justify-center gap-4 w-full">
            <div className="flex justify-between w-[50%] mx-auto">
                <div className="flex gap-4 relative z-10">
                    {/* <button onClick={add} className="bg-teal-700 hover:bg-teal-600 text-white py-2 px-4 rounded-md shadow">הוסף</button> */}
                    {0 < selectedRows.length && <button onClick={handleRemove} className="bg-red-500 hover:bg-red-400 py-2 px-4 text-white rounded-md shadow">מחק</button>}
                </div>
                <span className="py-2 text-xl">מלאי מרה"ס</span>
            </div>

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine mx-auto w-[50%] h-[70vh] shadow-lg">

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

export default MarhasInventory;
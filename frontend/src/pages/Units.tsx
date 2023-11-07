import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useQuery } from "react-query";
import axios from "axios";

const Units = () => {

    const unitsQuery = useQuery('units', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/units").then(res => res.json())
    );

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    useEffect(() => {
        if (unitsQuery.data) setRowData(unitsQuery.data);
        console.log(rowData);

    }, [unitsQuery.data]);

    // Each Column Definition results in one Column.
    const [columnDefs, setColumnDefs] = useState([
        { field: 'unit_id', headerName: 'מזהה', filter: true, editable: false, hide: true },
        { field: 'unit_name', headerName: 'שם הפריט', filter: true },
        { field: 'command_id', headerName: 'פיקוד' }
    ]);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(() => ({
        sortable: true,
        flex: 1,
        editable: true
    }));

    // Example of consuming Grid Event
    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);
    }, []);

    // Example using Grid's API
    const buttonListener = useCallback(e => {
        gridRef.current.api.deselectAll();
    }, []);

    const handleChange = e => {
        console.log(e.data);
        const copy = structuredClone(e.data);
        console.log(copy);

        updateUnit(copy);
    }

    const updateUnit = unit => axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + "/updateUnit", unit)
        .then(res => unitsQuery.refetch())
        .catch(err => console.error(unit));

    return (
        <div className="flex flex-col justify-center gap-4">
            units page

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine mx-auto" style={{ width: 750, height: 500 }}>

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

export default Units;
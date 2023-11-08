import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo } from "react";


// need props
// title
// rowData
// columnDefs
// handleRemove
// handleChange
// handleAdd
// gridRef
// setSelectedRows

const GenericGrid = props => {

    const defaultColDef = useMemo(() => ({
        sortable: true,
        flex: 1,
        editable: true
    }));

    const cellClickedListener = useCallback(event => {
        props.setSelectedRows(props.gridRef.current!.api.getSelectedRows());
    }, []);

    return (
        <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between w-[50%] mx-auto">
                <span className="flex gap-4">
                    <button onClick={props.handleAdd} className="bg-teal-700 hover:bg-teal-600 text-white py-2 px-4 rounded-md shadow">הוסף</button>
                    {0 < props.selectedRows.length && <button onClick={props.handleRemove} className="bg-red-500 hover:bg-red-400 py-2 px-4 text-white rounded-md shadow">מחק</button>}
                </span>
                <span>{props.title}</span>
            </div>

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine mx-auto w-[50%] h-[70vh] shadow-lg">

                <AgGridReact
                    ref={props.gridRef} // Ref for accessing Grid's API
                    enableRtl={true}
                    rowData={props.rowData} // Row Data for Rows
                    onCellValueChanged={props.handleChange}
                    columnDefs={props.columnDefs} // Column Defs for Columns
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

export default GenericGrid;
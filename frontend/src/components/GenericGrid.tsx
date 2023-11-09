import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { GenericGridProps } from "../types/GenericGridProps";
import axios from "axios";
import Combobox from "../components/Combobox";

const GenericGrid = (props: GenericGridProps) => {

    const gridRef = useRef();
    const url = `${import.meta.env.VITE_REACT_APP_BASE_URL}/${props.type}`;
    const [rowData, setRowData] = useState([]);
    const [selectedRows, setSelectedRows] = useState<unit[]>([]);

    const query = useQuery(props.type, () => fetch(url).then(res => res.json()));

    useEffect(() => {
        if (query.data) setRowData(query.data);
    }, [query.data]);

    useEffect(() => {
        if (!props.isReadonly) return;
        if (Object.keys(props.selectedUnit) < 1) setRowData(query.data);
        else setRowData(query.data.filter(row => row.unit_id === props.selectedUnit?.unit_id));
    }, [props.selectedUnit]);

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

        update(copy);
    }

    const handleRemove = () => {
        const ids: string[] = selectedRows.map(item => item[`${props.type.slice(0, -1)}_id`]);
        // remove(ids);
        remove(ids.toString());
    }

    const add = () => axios.post(url)
        .then(res => query.refetch())
        .catch(err => console.error(err));

    const update = (item) => axios.patch(url, item)
        .then(res => query.refetch())
        .catch(err => console.error(err));

    const remove = (ids: string) => axios.delete(url, { data: { ids } })
        .then(res => query.refetch())
        .catch(err => console.error(err));

    return (
        <div className="flex flex-col justify-center gap-4 w-full">
            <div className="flex justify-between w-[50%] mx-auto">
                <div className="flex gap-4 relative z-10">
                    <div className="absolute z-50">
                        {props.isReadonly && <Combobox selectedUnit={props.selectedUnit} setSelectedUnit={props.setSelectedUnit} />}
                    </div>
                    {!props.isReadonly && <button onClick={add} className="bg-teal-700 hover:bg-teal-600 text-white py-2 px-4 rounded-md shadow">הוסף</button>}
                    {0 < selectedRows.length && !props.isReadonly && <button onClick={handleRemove} className="bg-red-500 hover:bg-red-400 py-2 px-4 text-white rounded-md shadow">מחק</button>}
                </div>
                <span className="py-2">{props.title}</span>
            </div>

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine mx-auto w-[50%] h-[70vh] shadow-lg">

                <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API
                    enableRtl={true}
                    rowData={rowData} // Row Data for Rows
                    onCellValueChanged={handleChange}
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
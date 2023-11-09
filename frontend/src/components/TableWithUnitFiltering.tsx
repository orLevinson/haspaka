import { ColDef } from "ag-grid-community";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import GenericGrid from "../components/GenericGrid";

const TableWithUnitFiltering = (props) => {

    const itemsQuery = useQuery<item[]>('items', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/items").then(res => res.json())
    );

    const unitsQuery = useQuery<command[]>('units', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/units").then(res => res.json())
    );

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const [itemMappings, setItemMappings] = useState<{ [key: number]: string }>({});
    const [unitMappings, setUnitMappings] = useState<{ [key: number]: string }>({});
    const [selectedUnit, setSelectedUnit] = useState({});

    useEffect(() => {
        setColumnDefs([
            {
                field: 'item_id',
                headerName: 'פריט',
                cellEditor: 'agSelectCellEditor',
                filter: 'agSetColumnFilter',
                cellEditorParams: {
                    values: Object.keys(itemMappings)
                } as ISelectCellEditorParams,
                refData: itemMappings,
            },
            {
                field: 'unit_id',
                headerName: 'אוגדה',
                cellEditor: 'agSelectCellEditor',
                filter: 'agSetColumnFilter',
                cellEditorParams: {
                    values: Object.keys(unitMappings)
                } as ISelectCellEditorParams,
                refData: unitMappings,
            },
            { field: 'value', headerName: 'כמות', filter: true },
        ]);
    }, [itemMappings, unitMappings]);

    useEffect(() => {
        if (itemsQuery.data) {
            const c = {};
            itemsQuery.data.forEach(item => {
                c[item.item_id] = item.item_name;
            });
            setItemMappings(c);
        }
    }, [itemsQuery.data]);

    useEffect(() => {
        if (unitsQuery.data) {
            const c = {};
            unitsQuery.data.forEach(unit => {
                c[unit.unit_id] = unit.unit_name;
            });
            setUnitMappings(c);
        }
    }, [unitsQuery.data]);


    return (
        <div className="flex flex-col items-center w-full">
            <GenericGrid
                type={props.type}
                title={props.title}
                columnDefs={columnDefs}
                isReadonly={true}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
            />
        </div>
    );
}

export default TableWithUnitFiltering;
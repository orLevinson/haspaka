import { ColDef } from "ag-grid-community";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import GenericGrid from "../components/GenericGrid";
import { unit } from "../types/unit";
import { UserCtx } from "../shared/userCtx";

const TableWithUnitFiltering = (props) => {

    const { userData } = useContext(UserCtx);

    const itemsQuery = useQuery<item[]>('items', () =>
        axios.get(import.meta.env.VITE_REACT_APP_BASE_URL + "/items", {
            headers: { Authorization: `Bearer ${userData.token}` }
        }).then(res => res.data.body), { enabled: userData.token !== undefined }
    );

    const unitsQuery = useQuery<unit[]>('units', () =>
        axios.get(import.meta.env.VITE_REACT_APP_BASE_URL + "/units", {
            headers: { Authorization: `Bearer ${userData.token}` }
        }).then(res => res.data.body), { enabled: userData.token !== undefined }
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
                editable: false,
                cellEditorParams: {
                    values: Object.keys(itemMappings)
                } as ISelectCellEditorParams,
                refData: itemMappings,
            },
            {
                field: 'unit_id',
                headerName: 'אוגדה',
                cellEditor: 'agSelectCellEditor',
                editable: false,
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
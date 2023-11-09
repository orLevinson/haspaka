import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import GenericGrid from "../components/GenericGrid";

const GivenSoFar = () => {

    const itemsQuery = useQuery<item[]>('items', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/items").then(res => res.json())
    );

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const [itemMappings, setItemMappings] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        setColumnDefs([
            { field: 'date', headerName: 'תאריך', filter: true, editable: false, },
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
            { field: 'value', headerName: 'כמות', filter: true },
        ]);
    }, [itemMappings]);

    useEffect(() => {
        if (itemsQuery.data) {
            const c = {};
            itemsQuery.data.forEach(item => {
                c[item.item_id] = item.item_name;
            });
            setItemMappings(c);
        }
    }, [itemsQuery.data]);

    return ( 
        <div className="flex flex-col items-center w-full">
            <GenericGrid
                type="givenSoFar"
                title="נופק עד כה"
                columnDefs={columnDefs}
            />
        </div>
     );
}

export default GivenSoFar;
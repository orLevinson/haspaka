import { ColDef } from "ag-grid-community";
import { useState } from "react";
import GenericGrid from "../components/GenericGrid";
import { unit } from "../types/unit";

const TableWithUnitFiltering = (props: { type: string; title: string }) => {
    const [selectedUnit, setSelectedUnit] = useState<unit | undefined>();
    const [columnDefs, _setColumnDefs] = useState<ColDef[]>([
        {
            field: "unit_name",
            headerName: "אוגדה",
            filter: true,
            editable: false,
            sort: "asc",
        },
        {
            field: "item_name",
            headerName: "פריט",
            filter: true,
            editable: false,
            sort: "asc",
        },
        { field: "value", headerName: "כמות", filter: true },
    ]);

    return (
        <div className="flex flex-col items-center w-full">
            <GenericGrid
                type={props.type}
                title={props.title}
                columnDefs={columnDefs}
                isReadonly={true}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                isTableWithUnitFiltering
                noAddOrDelete
            />
        </div>
    );
};

export default TableWithUnitFiltering;

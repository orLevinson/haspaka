import { ColDef } from "ag-grid-community";
import { useContext, useEffect, useState } from "react";
import GenericGrid from "../components/GenericGrid";
import { unit } from "../types/unit";
import { UserCtx } from "../shared/userCtx";
import axios from "axios";

const TableWithUnitFiltering = (props) => {

    const { userData } = useContext(UserCtx);

    const [selectedUnit, setSelectedUnit] = useState({});
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'unit_name', headerName: 'אוגדה', filter: true, editable: false, sort: "asc" },
        { field: 'item_name', headerName: 'פריט', filter: true, editable: false, sort: "asc" },
        { field: 'value', headerName: 'כמות', filter: true },
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
            />
        </div>
    );
}

export default TableWithUnitFiltering;
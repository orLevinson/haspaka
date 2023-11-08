import { Fragment, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import GenericGrid from "../components/GenericGrid";
import { unit } from "../types/unit";
import Combobox from "../components/Combobox";

const IdealInventory = () => {

    // const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    //     { field: 'item_id', headerName: 'פריט', filter: true },
    //     { field: 'unit_id', headerName: 'אוגדה', filter: true },
    //     { field: 'value', headerName: 'כמות', filter: true },
    // ]);

    const [selectedUnit, setSelectedUnit] = useState('');

    return (
        <div className="flex flex-col items-center">
            <div>
                <Combobox selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit} />
            </div>
        </div>
    )
}

export default IdealInventory;
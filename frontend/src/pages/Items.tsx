import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import axios from "axios";
import { ColDef } from "ag-grid-community";
import GenericGrid from "../components/GenericGrid";

const Items = () => {

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'item_id', hide: true },
        { field: 'item_name', headerName: 'שם הפריט', filter: true },
        {
            field: 'item_type',
            headerName: 'סוג הפריט',
            cellEditor: 'agSelectCellEditor',
            filter: 'agSetColumnFilter',
            cellEditorParams: {
                values: ['שהייה', 'חורף']
            } as ISelectCellEditorParams,
        }
    ]);

    return (
        <GenericGrid
            type="items"
            title="הגדרת פריטים"
            columnDefs={columnDefs}
        />
    )
}

export default Items;
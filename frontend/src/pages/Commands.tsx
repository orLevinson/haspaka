import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { command } from "../types/command";
import axios from "axios";
import GenericGrid from "../components/GenericGrid";

const Commands = () => {

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'command_id', headerName: 'מזהה', filter: true, editable: false, hide: true },
        { field: 'command_name', headerName: 'שם הפיקוד', filter: true },
    ]);

    return (
        <GenericGrid
            title="הגדרת פיקודים"
            type="commands"
            columnDefs={columnDefs}
        />
    )
}

export default Commands;
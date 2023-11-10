import { useContext, useEffect, useState } from "react";
import useCheckPermission from "../shared/useCheckPermission";
import { ColDef } from "ag-grid-community";
import GenericGrid from "../components/GenericGrid";
import { useQuery } from "react-query";
import { UserCtx } from "../shared/userCtx";
import axios from "axios";

const Users = () => {

    const { userData } = useContext(UserCtx);
    useCheckPermission({ permission: "admins" });

    const commandsQuery = useQuery<command[]>(
        "commands",
        () =>
            axios
                .get(import.meta.env.VITE_REACT_APP_BASE_URL + "/commands", {
                    headers: { Authorization: `Bearer ${userData.token}` },
                })
                .then((res) => res.data.body),
        { enabled: userData.token !== undefined }
    );

    const [commandMappings, setCommandMappings] = useState<{
        [key: number]: string;
    }>({});

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

    useEffect(() => {
        if (commandsQuery.data) {
            const c: { [x: number]: string } = {};
            commandsQuery.data.forEach((command) => {
                c[command.command_id] = command.command_name;
            });
            setCommandMappings(c);
        }
    }, [commandsQuery.data]);

    useEffect(() => {
        setColumnDefs([
            { field: "user_id", headerName: "מזהה", hide: true },
            { field: "username", headerName: "שם משתמש", filter: true, sort: "asc" },
            { field: "name", headerName: "שם", filter: true },
            {
                field: "command_id",
                headerName: "פיקוד",
                cellEditor: "agSelectCellEditor",
                filter: "agSetColumnFilter",
                cellEditorParams: {
                    values: Object.keys(commandMappings),
                } as ISelectCellEditorParams,
                refData: commandMappings,
            },
        ]);
    }, [commandMappings]);


    return (
        <GenericGrid
            title="ניהול משתמשים"
            type="users"
            columnDefs={columnDefs}
            noAddOrDelete
        />
    );
}

export default Users;
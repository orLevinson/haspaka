import TableWithItemsAsColumns from "../components/TableWithItemsAsColumns";
import useCheckPermission from "../shared/useCheckPermission";

const MarhasInventory = () => {
    useCheckPermission({permission: "admins"})

    return (
        <TableWithItemsAsColumns type="marhasInventory" title='מלאי מרה"ס' />
    )

}

export default MarhasInventory;
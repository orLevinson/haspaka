import TableWithItemsAsColumns from "../components/TableWithItemsAsColumns";
import useCheckPermission from "../shared/useCheckPermission";

const InventoryTracking = () => {

    useCheckPermission({ permission: "admins" })

    return (
        <TableWithItemsAsColumns type="inventoryTracking" title='מעקב פערים' />
    );
}

export default InventoryTracking;
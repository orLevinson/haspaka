import TableWithItemsAsColumns from "../components/TableWithItemsAsColumns";
import useCheckPermission from "../shared/useCheckPermission";

const InventoryTracking = () => {

    useCheckPermission({ permission: "admins" })

    const description = <>
        בעמוד זה ניתן לראות את תמונת המצב הכלל צהלית מבחינת פערי יחידות בחתך פריטים וזמן.
        בלחיצה על כפתור הוספת רשומה חדשה, המערכת תגזור באופן אוטומטי את סכומי פערי היחידות שהוזנו במסך "פערים".
        ניתן גם לאחר החישוב האוטומטי של פערי היחידות, לערוך באופן ידני את סכומי הפערים ולדרוס את הערך שחושב באופן אוטומטי וכן למחוק רשומות.
    </>

    return (
        <TableWithItemsAsColumns
            type="inventoryTracking"
            title='מעקב פערים'
            description={description}
        />
    );
}

export default InventoryTracking;
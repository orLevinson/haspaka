import TableWithItemsAsColumns from "../components/TableWithItemsAsColumns";
import useCheckPermission from "../shared/useCheckPermission";

const MarhasInventory = () => {

    useCheckPermission({ permission: "admins" })

    const description = <>
        בעמוד זה ניתן להזין ברמה הכלל צה"לית את מלאי המרה"ס הנוכחי על פי סוג פריט לאותו חתך זמן.
        נתונים אלו יגזרו באופן ישיר לדשבורד המשלים את המערכת.
    </>

    return (
        <TableWithItemsAsColumns
            type="marhasInventory"
            title='מלאי מרה"ס'
            description={description}
        />
    )

}

export default MarhasInventory;
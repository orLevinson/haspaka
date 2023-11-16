import TableWithItemsAsColumns from "../components/TableWithItemsAsColumns";
import useCheckPermission from "../shared/useCheckPermission";

const GivenSoFar = () => {

  useCheckPermission({ permission: "admins" });

  const description = <>
    בעמוד זה ניתן להזין ברמה הכלל צה"לית את כמות הפריטים שנופקו על פי סוג פריט ממלאי המרה"ס.
    ההזנה תתבצע לפי תאריכים כאשר בכל תאריך תצוין תמונת המצב הכלל צהלית באותו חתך זמן.
    נתונים אלו יגזרו באופן ישיר לדשבורד המשלים את המערכת.
  </>

  return <TableWithItemsAsColumns
    type="givenSoFar"
    title="נופק עד כה"
    description={description}
  />;
};

export default GivenSoFar;

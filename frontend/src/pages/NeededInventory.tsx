import TableWithFiltering from "../components/TableWithFiltering";
import useCheckPermission from "../shared/useCheckPermission";

const NeededInventory = () => {

  useCheckPermission({ permission: "commands" });

  const decription = <>
    בעמוד זה ניתן להזין בעבור כל פריט מהו החוסר הקיים בכל יחידה.
    לאחר שינוי ערכי פערי היחידות הנתונים ישמרו במערכת באופן אוטומטי.
    ניתן להציג את פערי כל יחידה באופן נפרד ע"י שימוש בסנן האוגדות המופיע בראש הדף.
  </>

  return <TableWithFiltering
    type="neededInventory"
    title="פערים"
    filtering="units"
    decription={decription}
  />;
};

export default NeededInventory;

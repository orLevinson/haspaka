import TableWithFiltering from "../components/TableWithFiltering";
import useCheckPermission from "../shared/useCheckPermission";

const FutureSupplied = () => {

  useCheckPermission({ permission: "commands" });

  const decription = <>
    בעמוד זה ניתן לצפות בפריטים שאושרו לניפוק ועומדים להשלים את פערי היחידות בזמן הקרוב.
    ניתן לצפות בפריטים שאושרו לניפוק לפי פיקוד ספציפי ע"י שימוש בסנן הפיקודים המופיע בראש הדף.
  </>

  return <TableWithFiltering
    type="futureSupplied"
    title="אושר לניפוק"
    onlyAdminsCanEdit={true}
    filtering="commands"
    decription={decription}
  />;
};

export default FutureSupplied;

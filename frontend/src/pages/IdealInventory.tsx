import TableWithFiltering from "../components/TableWithFiltering";
import useCheckPermission from "../shared/useCheckPermission";

const IdealInventory = () => {

  useCheckPermission({ permission: "commands" });

  const decription = <>
    תקן המודל מגדיר את מספר הפריטים המוקצים לאותה יחידה בהתאם לסד"כים וזכאות יחידות.
    בעמוד זה תוכלו לבדוק בעבור כל פריט מהו תקן המודל המוקצה ליחידותכם.
  </>

  return (
    <TableWithFiltering
      type="idealInventory"
      title="תקן מודל"
      onlyAdminsCanEdit={true}
      filtering="units"
      decription={decription}
    />
  );
};

export default IdealInventory;

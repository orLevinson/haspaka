import TableWithFiltering from "../components/TableWithFiltering";
import useCheckPermission from "../shared/useCheckPermission";

const IdealInventory = () => {
  useCheckPermission({ permission: "commands" });

  return (
    <TableWithFiltering
      type="idealInventory"
      title="תקן מודל"
      onlyAdminsCanEdit={true}
      filtering="units"
    />
  );
};

export default IdealInventory;

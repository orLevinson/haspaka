import TableWithUnitFiltering from "../components/TableWithUnitFiltering";
import useCheckPermission from "../shared/useCheckPermission";

const IdealInventory = () => {
  useCheckPermission({ permission: "commands" });

  return (
    <TableWithUnitFiltering
      type="idealInventory"
      title="תקן מודל"
      onlyAdminsCanEdit={true}
    />
  );
};

export default IdealInventory;

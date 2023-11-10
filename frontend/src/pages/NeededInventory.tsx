import TableWithUnitFiltering from "../components/TableWithUnitFiltering";
import useCheckPermission from "../shared/useCheckPermission";

const NeededInventory = () => {
  useCheckPermission({ permission: "commands" });

  return <TableWithUnitFiltering type="neededInventory" title="פערים" />;
};

export default NeededInventory;

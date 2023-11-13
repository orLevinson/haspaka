import TableWithFiltering from "../components/TableWithFiltering";
import useCheckPermission from "../shared/useCheckPermission";

const NeededInventory = () => {
  useCheckPermission({ permission: "commands" });

  return <TableWithFiltering
    type="neededInventory"
    title="פערים"
    filtering="units"
  />;
};

export default NeededInventory;

import TableWithFiltering from "../components/TableWithFiltering";
import useCheckPermission from "../shared/useCheckPermission";

const FutureSupplied = () => {
  useCheckPermission({ permission: "commands" });

  return <TableWithFiltering
    type="futureSupplied"
    title="אושר לניפוק"
    onlyAdminsCanEdit={true}
    filtering="commands"
  />;
};

export default FutureSupplied;

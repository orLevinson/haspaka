import TableWithUnitFiltering from "../components/TableWithUnitFiltering";
import useCheckPermission from "../shared/useCheckPermission";

const FutureSupplied = () => {
  useCheckPermission({ permission: "commands" });

  return <TableWithUnitFiltering
    type="futureSupplied"
    title="אושר לניפוק"
    onlyAdminsCanEdit={true}
  />;
};

export default FutureSupplied;

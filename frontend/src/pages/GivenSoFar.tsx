import TableWithItemsAsColumns from "../components/TableWithItemsAsColumns";
import useCheckPermission from "../shared/useCheckPermission";

const GivenSoFar = () => {
  useCheckPermission({ permission: "admins" });

  return <TableWithItemsAsColumns type="givenSoFar" title="נופק עד כה" />;
};

export default GivenSoFar;

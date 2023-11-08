import { command } from "./command";
import { item } from "./item";
import { unit } from "./unit";

interface GenericGridProps {
    title: string;
    handleAdd: () => void;
    handleRemove: () => void;
    xhandleChange: () => void;
    columnDefs: ColDef[];
    selectedRows: unit[] | command[] | item[];
    setSelectedRows: (a: unit[] | command[] | item[]) => void;
    gridRef: React.Ref;
    type: string;
}

export { GenericGridProps };
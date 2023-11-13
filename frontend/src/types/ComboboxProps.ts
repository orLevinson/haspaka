import { command } from "./command";
import { unit } from "./unit";

interface ComboboxProps {
    selected?: unit | command;
    setSelected: any;
    filtering: string;
}

export type { ComboboxProps };
import { Fragment, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Combobox as HeadlessUICombobox } from "@headlessui/react";
import { unit } from "../types/unit";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ComboboxProps } from "../types/ComboboxProps";
import { UserCtx } from "../shared/userCtx";
import axios from "axios";
import { toast } from "react-toastify";
import { command } from "../types/command";

const Combobox = (props: ComboboxProps) => {
  const { userData } = useContext(UserCtx);

  const itemsQuery = useQuery<unit[] | command[]>(
    props.filtering,
    () =>
      axios
        .get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/${props.filtering}`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
        .then((res) => res.data.body)
        .catch(() => {
          toast.error("חלה שגיאה בעת שליפת הנתונים");
          return [];
        }),
    { enabled: userData.token !== undefined }
  );

  const [query, setQuery] = useState("");
  const [data, setData] = useState<unit[] | command[]>([]);
  const [filtered, setFiltered] = useState<(command | unit)[]>([]);

  useEffect(() => {
    if (itemsQuery.data) setData(itemsQuery.data);
  }, [itemsQuery.data]);

  const isUnit = (item: unit | command): item is unit => {
    return 'unit_id' in item && 'unit_name' in item;
  }

  useEffect(() => {
    setFiltered(
      data.filter((item) => isUnit(item)
        ? item.unit_name.includes(query)
        : item.command_name.includes(query)
      )
    );
  }, [query]);

  const handleClear = () => {
    setQuery("");
    props.setSelected({});
  };

  return (
    <HeadlessUICombobox
      value={props.selected}
      onChange={props.setSelected}
    >
      {props.selected && 0 < Object.keys(props.selected).length && (
        <button onClick={handleClear} className="absolute -right-8 top-2.5">
          <XMarkIcon className="w-6 h-6" />
        </button>
      )}
      <HeadlessUICombobox.Input
        placeholder={props.filtering === 'units' ? "בחר אוגדה" : "בחר פיקוד"}
        dir="rtl"
        displayValue={(item: unit | command) => isUnit(item) ? item.unit_name : item.command_name}
        className="text-white bg-teal-600 placeholder-opacity-50 placeholder-white hover:bg-teal-700 focus:ring-4 focus:ring-teal-100  shadow rounded-lg appearance-none focus:outline-none px-5 py-2.5"
        onChange={(event) => setQuery(event.target.value)}
      />
      <HeadlessUICombobox.Options className="bg-white shadow mt-4 rounded-lg max-h-64 overflow-y-auto">
        {filtered.map((item) => (
          <HeadlessUICombobox.Option
            key={isUnit(item) ? item.unit_id : item.command_id}
            value={item}
            as={Fragment}
          >
            <li className="block px-4 py-2 hover:bg-gray-100">
              {isUnit(item) ? item.unit_name : item.command_name}
            </li>
          </HeadlessUICombobox.Option>
        ))}
      </HeadlessUICombobox.Options>
    </HeadlessUICombobox>
  );
};

export default Combobox;

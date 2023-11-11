import { Fragment, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Combobox as HeadlessUICombobox } from "@headlessui/react";
import { unit } from "../types/unit";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ComboboxProps } from "../types/ComboboxProps";
import { UserCtx } from "../shared/userCtx";
import axios from "axios";
import { toast } from "react-toastify";

const Combobox = (props: ComboboxProps) => {
  const { userData } = useContext(UserCtx);

  const unitsQuery = useQuery<unit[]>(
    "units",
    () =>
      axios
        .get(import.meta.env.VITE_REACT_APP_BASE_URL + "/units", {
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
  const [units, setUnits] = useState<unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<unit[]>([]);

  useEffect(() => {
    if (unitsQuery.data) setUnits(unitsQuery.data);
  }, [unitsQuery.data]);

  useEffect(() => {
    setFilteredUnits(units.filter((unit) => unit.unit_name.includes(query)));
  }, [query]);

  const handleClear = () => {
    setQuery("");
    props.setSelectedUnit({});
  };

  return (
    <HeadlessUICombobox
      value={props.selectedUnit}
      onChange={props.setSelectedUnit}
    >
      {query !== "" && (
        <button onClick={handleClear} className="absolute -right-8 top-2.5">
          <XMarkIcon className="w-6 h-6" />
        </button>
      )}
      <HeadlessUICombobox.Input
        placeholder="בחר אוגדה"
        dir="rtl"
        displayValue={(unit: unit) => unit.unit_name}
        className="text-white bg-teal-600 placeholder-opacity-50 placeholder-white hover:bg-teal-700 focus:ring-4 focus:ring-teal-100  shadow rounded-lg appearance-none focus:outline-none px-5 py-2.5"
        onChange={(event) => setQuery(event.target.value)}
      />
      <HeadlessUICombobox.Options className="bg-white shadow mt-4 rounded-lg max-h-64 overflow-y-auto">
        {filteredUnits.map((unit) => (
          <HeadlessUICombobox.Option
            key={unit.unit_id}
            value={unit}
            as={Fragment}
          >
            <li className="block px-4 py-2 hover:bg-gray-100">
              {unit.unit_name}
            </li>
          </HeadlessUICombobox.Option>
        ))}
      </HeadlessUICombobox.Options>
    </HeadlessUICombobox>
  );
};

export default Combobox;

import { Fragment, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import GenericGrid from "../components/GenericGrid";
import { Combobox as HeadlessUICombobox } from '@headlessui/react'
import { unit } from "../types/unit";

const Combobox = props => {

    const unitsQuery = useQuery<unit[]>('units', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/units").then(res => res.json())
    );

    const [query, setQuery] = useState('');
    const [units, setUnits] = useState<unit[]>([]);
    const [filteredUnits, setFilteredUnits] = useState<unit[]>([]);

    useEffect(() => {
        if (unitsQuery.data) setUnits(unitsQuery.data);
    }, [unitsQuery.data]);

    useEffect(() => {
        setFilteredUnits(units.filter(unit => unit.unit_name.includes(query)));
    }, [query]);

    return (
        <HeadlessUICombobox value={props.selectedUnit} onChange={props.setSelectedUnit}>
            <HeadlessUICombobox.Input displayValue={(unit: unit) => unit.unit_name} className='text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:ring-teal-100  shadow rounded-lg appearance-none focus:outline-none px-5 py-2.5' onChange={(event) => setQuery(event.target.value)} />
            <HeadlessUICombobox.Options className='white shadow mt-4 rounded-lg max-h-64 overflow-y-auto'>
                {filteredUnits.map((unit) => (
                    <HeadlessUICombobox.Option key={unit.unit_id} value={unit} as={Fragment}>
                        <li className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white '>
                            {unit.unit_name}
                        </li>
                    </HeadlessUICombobox.Option>
                ))}
            </HeadlessUICombobox.Options>
        </HeadlessUICombobox>
    );
}

export default Combobox;
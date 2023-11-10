import { AgGridReact } from "ag-grid-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { GenericGridProps } from "../types/GenericGridProps";
import axios from "axios";
import Combobox from "../components/Combobox";
import { CellValueChangedEvent } from "ag-grid-community";
import { UserCtx } from "../shared/userCtx";
import { toast } from "react-toastify";

const GenericGrid = (props: GenericGridProps) => {
  const gridRef = useRef<AgGridReact>();
  const url = `${import.meta.env.VITE_REACT_APP_BASE_URL}/${props.type}`;
  const [rowData, setRowData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // const [data, setData] = useState([]);
  const { userData } = useContext(UserCtx);

  const query = useQuery(
    props.type,
    () =>
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
        .then((res) => res.data.body)
        .catch(() => {
          toast.error("חלה שגיאה במהלך שליפת הנתונים");
          return [];
        }),
    { enabled: userData.token !== undefined }
  );

  useEffect(() => {
    if (query.data) {
      console.log(query.data);

      setRowData(
        query.data.map((item: { date: string | Date }) =>
          item.date ? { ...item, date: new Date(item.date) } : item
        )
      );
    }
  }, [query.data, props.columnDefs]);

  useEffect(() => {
    if (!props.isTableWithUnitFiltering || !props.selectedUnit) return;
    if (Object.keys(props.selectedUnit).length < 1) setRowData(query.data);
    else
      setRowData(
        query.data.filter(
          (row: { unit_id: number | undefined }) =>
            row.unit_id === props.selectedUnit?.unit_id
        )
      );
  }, [props.selectedUnit]);

  const defaultColDef = {
    sortable: true,
    flex: 1,
    editable: true,
  };

  const cellClickedListener = useCallback(() => {
    setSelectedRows(gridRef.current!.api.getSelectedRows());
  }, []);

  const handleChange = (e: CellValueChangedEvent) => {
    const copy = structuredClone(e.data);
    update(copy);
  };

  const handleRemove = () => {
    const ids: string[] = selectedRows.map(
      (item) => item[`${props.type.slice(0, -1)}_id`]
    );
    const itemAttribute = `${props.type}_ids`;
    remove(itemAttribute, ids);
  };

  const add = () =>
    axios
      .post(url, undefined, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((_res) => query.refetch())
      .catch(() => toast.error("חלה שגיאה במהלך הוספת הנתונים"));

  const update = (item: any) => {
    const itemAttribute = `${props.type.slice(0, -1)}_id`;
    const urlToPatch = props.isTableWithUnitFiltering
      ? url
      : `${url}/${item[itemAttribute]}`;
    axios
      .patch(urlToPatch, item, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((_res) => query.refetch())
      .catch(() => toast.error("חלה שגיאה במהלך עדכון הנתונים"));
  };

  const remove = (key: string, ids: string[]) =>
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        data: { [key]: ids },
      })
      .then((_res) => query.refetch())
      .catch(() => toast.error("חלה שגיאה במהלך מחיקת הנתונים"));

  return (
    <div className="flex flex-col justify-center gap-4 w-full mt-8">
      <div className="flex justify-between w-[50%] mx-auto">
        <span className="py-2 text-xl">{props.title}</span>
        <div className="flex gap-4 relative z-10">
          <div className="absolute z-50 left-0">
            {props.isTableWithUnitFiltering && (
              <Combobox
                selectedUnit={props.selectedUnit}
                setSelectedUnit={props.setSelectedUnit}
              />
            )}
          </div>
          {!props.noAddOrDelete && (
            <button
              onClick={add}
              className="bg-teal-700 hover:bg-teal-600 text-white py-2 px-4 rounded-md shadow"
            >
              הוסף
            </button>
          )}
          {0 < selectedRows.length && !props.noAddOrDelete && (
            <button
              onClick={handleRemove}
              className="bg-red-500 hover:bg-red-400 py-2 px-4 text-white rounded-md shadow"
            >
              מחק
            </button>
          )}
        </div>
      </div>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine mx-auto w-[50%] h-[80vh] shadow-lg">
        <AgGridReact
          // @ts-ignore
          ref={gridRef} // Ref for accessing Grid's API
          enableRtl={true}
          rowData={rowData} // Row Data for Rows
          onCellValueChanged={handleChange}
          columnDefs={props.columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          enableCellChangeFlash={true}
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

export default GenericGrid;

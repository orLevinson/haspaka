import { AgGridReact } from "ag-grid-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { inventory } from "../types/inventory";
import { item } from "../types/item";
import {
  CellClickedEvent,
  CellValueChangedEvent,
  ColDef,
} from "ag-grid-community";
import axios from "axios";
import { UserCtx } from "../shared/userCtx";
import { toast } from "react-toastify";

const TableWithItemsAsColumns = (props: { type: string; title: string }) => {
  const { userData } = useContext(UserCtx);

  const itemsQuery = useQuery<item[]>(
    "items",
    () =>
      axios
        .get(import.meta.env.VITE_REACT_APP_BASE_URL + "/items", {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
        .then((res) => res.data.body),
    { enabled: userData.token !== undefined }
  );

  const gridRef = useRef<AgGridReact>();
  const [_itemMappings, setItemMappings] = useState<{ [key: number]: string }>(
    {}
  );
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const url = `${import.meta.env.VITE_REACT_APP_BASE_URL}/${props.type}`;

  const query = useQuery<inventory[]>(
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

  // set the column definition according to the items
  useEffect(() => {
    if (itemsQuery.data) {
      const c: { [x: number]: string } = {};
      itemsQuery.data.forEach((item) => {
        c[item.item_id] = item.item_name;
      });
      setItemMappings(c);
      const dateColDef: ColDef = {
        field: "date",
        headerName: "תאריך",
        pinned: "right",
        width: 150,
        editable: false,
        cellRenderer: (data: any) =>
          data.value
            ? new Date(data.value).toLocaleDateString("en-IL", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
            : "",
      };
      const colDefs: ColDef[] = [dateColDef].concat(
        itemsQuery.data.map((i) => ({
          field: i.item_id.toString(),
          headerName: i.item_name,
          valueFormatter: (params) => (!params.value ? 0 : params.value),
        }))
      );
      setColumnDefs(colDefs);
    }
  }, [itemsQuery.data]);

  // set the row data
  useEffect(() => {
    if (query.data) {
      const dates: { [x: string]: { [y: number]: number } } = {};
      query.data.forEach((i: inventory) => {
        const date = new Date(i.date).toISOString();
        dates[date] = { ...dates[date], [i.item_id]: i.value };
      });
      setRowData(
        Object.keys(dates).map((date) => ({
          ...dates[date],
          date: new Date(date),
        }))
      );
    }
  }, [query.data]);

  const defaultColDef = {
    sortable: true,
    editable: true,
  };

  const cellClickedListener = useCallback((_event: CellClickedEvent) => {
    setSelectedRows(gridRef.current!.api.getSelectedRows());
  }, []);

  const handleChange = (e: CellValueChangedEvent) => {
    const itemId = parseInt(e.column.getColId());
    const value = parseInt(e.newValue);
    const date: Date = e.data.date;
    const result = { item_id: itemId, value: value, date: date };

    update(result);

    // item already exists
    // if (query.data.find(item => {
    //     const itemDate = new Date(item.date);
    //     itemDate.setMilliseconds(0);
    //     console.log(`itemDate: ${itemDate}`);
    //     console.log(`date: ${date}`);
    //     return itemDate === date && item.item_id === itemId;
    // })) console.log('update');
    // if (query.data.find(item => item.date === date && item.item_id === itemId)) update(result);

    // item not exists
    // else console.log('insert');
    // else insert(result);
  };

  const handleRemove = () => { };

  const insert = (item: inventory) =>
    axios
      .post(url, item, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((res) => query.refetch())
      .catch(() => toast.error("חלה שגיאה במהלך הוספת הנתונים"));

  const update = (item: inventory) =>
    axios
      .patch(url, item, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((res) => query.refetch())
      .catch(() => toast.error("חלה שגיאה במהלך עדכון הנתונים"));

  return (
    <div className="flex flex-col justify-center gap-4 w-full mt-8">
      <div className="flex justify-between w-[75%] mx-auto">
        <span className="py-2 text-xl">{props.title}</span>
        <div className="flex gap-4 relative z-10">
          {/* <button onClick={add} className="bg-teal-700 hover:bg-teal-600 text-white py-2 px-4 rounded-md shadow">הוסף</button> */}
          {0 < selectedRows.length && (
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
      <div className="ag-theme-alpine mx-auto w-[75%] h-[80vh] shadow-lg">
        <AgGridReact
          // @ts-ignore
          ref={gridRef} // Ref for accessing Grid's API
          enableRtl={true}
          rowData={rowData} // Row Data for Rows
          onCellValueChanged={handleChange}
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          enableCellChangeFlash={true}
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
      </div>
    </div>
  );
};

export default TableWithItemsAsColumns;

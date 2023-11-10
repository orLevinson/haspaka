enum Item_Types {
    חורף,
    שהייה
}

type item = {
    item_id: number;
    item_name: string;
    item_type: Item_Types;
}

export type { item };
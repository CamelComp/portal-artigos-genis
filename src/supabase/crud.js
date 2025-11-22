import { supabase } from '@/supabase/client';

export async function getRecordByFilter({
    table, 
    select = '*', 
    where = 'id', 
    value
}){
    const { data, status, error } = await supabase
        .from(table)
        .select(select)
        .eq(where, value);
    if(status != 200) {
        console.log(error);
    } return data[0];
}

export async function getRecordsInList({
    table,
    select = '*',
    column,
    values = []
}) {
    const { data, status, error } = await supabase
        .from(table)
        .select(select)
        .in(column, values);
    if(status !== 200) {
        console.log(error);
        return [];
    }
    return data;
}
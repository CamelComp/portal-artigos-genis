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

export async function insertRecord(table, obj){
    const { data, error } = await supabase
        .from(table)
        .insert(obj)
        .select('*');
    if(error) console.log(error);
    return data[0];
}

export async function updateRecordByFilter({
    table,
    values,        
    where = 'id',
    value
}) {
    const { data, status, error } = await supabase
        .from(table)
        .update(values)
        .eq(where, value)
        .select('*');
    if(status !== 200) {
        console.log(error);
        return null;
    }
    return data[0];
}
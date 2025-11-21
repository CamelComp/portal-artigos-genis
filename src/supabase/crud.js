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
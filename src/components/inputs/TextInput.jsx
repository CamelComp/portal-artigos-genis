export function TextInput({ 
    label, 
    value, 
    setValue, 
    disabled,
    type = 'text', 
    placeholder = '...'
}){
    return(
        <input type={type}
            name={label}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
                border rounded
                h-[35px] w-full px-2
            `}
        />
    )
}
export function Box({
    width = 'w-full',
    className = '',
    children,
}) {
    return (
        <div className={`
            flex flex-col gap-2
            ${width} p-4 rounded-2xl
            bg-white shadow-sm
            ${className}
        `}>
            {children}
        </div>
    );
}
export function Main({ children }) {
    return (
        <main className={`
            flex items-start justify-center
            min-h-screen w-screen p-6
        `}>
            {children}
        </main>
    );
}  
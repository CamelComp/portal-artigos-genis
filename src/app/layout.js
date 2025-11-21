import './globals.css';

export const metadata = {
    title: 'Portal de Artigos - Genis'
};

export default function RootLayout({ children }) {
    return (
        <html lang='pt-br'>
            <body className={`antialiased`}>
                {children}
            </body>
        </html>
    );
}

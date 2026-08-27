import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
    title: "Manual do Skatista",
    description: "Seu guia completo para o universo do skate."
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                <Header />

                <main id="mainContent">
                    {children}
                </main>

                <Footer />
            </body>
        </html>
    );
}
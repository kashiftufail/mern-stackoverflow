import "../styles/global.css";
import AuthProvider from "@/components/AuthProvider";
import ReduxProvider from "@/components/ReduxProvider";
import Header from "@/components/Header";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import Footer from "@/components/Footer";

export const metadata = {
  title: "StackLite",
  description: "A StackOverflow clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        <ReduxProvider>
          <AuthProvider>
            <Header />
            <div className="flex flex-1">
              <SidebarLeft />
              <main className="flex-1 p-6">{children}</main>
              <SidebarRight />
            </div>
            <Footer />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

import "../styles/globals.css";
import { DarkModeProvider } from "../context/DarkModeContext"; // ✅ Import DarkModeProvider
import AuthProvider from "../components/AuthProvider";

export default function MyApp({ Component, pageProps }) {
  return (
    <DarkModeProvider> {/* ✅ Wrap entire app */}
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </DarkModeProvider>
  );
}

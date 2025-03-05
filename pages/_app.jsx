import "../styles/globals.css";
import { DarkModeProvider } from "../context/DarkModeContext"; // ✅ Ensure this exists
import AuthProvider from "../components/AuthProvider.jsx"; // ✅ Ensure this exists

export default function MyApp({ Component, pageProps }) {
  return (
      //<AuthProvider>  {/* Wrap with AuthProvider */}
        <Component {...pageProps} />
      //</AuthProvider>
  );
}

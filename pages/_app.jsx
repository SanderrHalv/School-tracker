import "../styles/globals.css";
import { DarkModeProvider } from "../context/DarkModeContext"; 
import AuthProvider from "../components/AuthProvider.jsx";

export default function MyApp({ Component, pageProps }) {
  return (
      //<AuthProvider>  {/* Wrap with AuthProvider */}
        <Component {...pageProps} />
      //</AuthProvider>
  );
}

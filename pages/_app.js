import "../styles/globals.css";
import { DarkModeProvider } from "../context/DarkModeContext";
import AuthProvider from "../components/AuthProvider";

export default function MyApp({ Component, pageProps }) {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </DarkModeProvider>
  );
}

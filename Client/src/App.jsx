import "@mantine/core/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.js";
import { AuthenticationForm } from "./AuthenticationForm.js";

export default function App() {
  return (
    <MantineProvider theme={theme}>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthenticationForm />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
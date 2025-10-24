import "@mantine/core/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.js";
import { AuthenticationForm } from "./AuthenticationForm";
import HomePage from "./HomePage";

export default function App() {
  return (
        <BrowserRouter>
      <MantineProvider theme={theme}>
        <Routes>
          <Route path="/" element={<AuthenticationForm />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </MantineProvider>
    </BrowserRouter>
  );
}
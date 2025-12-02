import "@mantine/core/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.js";
import { AuthenticationForm } from "./AuthenticationForm";
import HomePage from "./HomePage";
import Meals from "./MealsPage";
import Plans from "./PlansPage";
import AppShellLayout from "./AppShellLayout";
import RequireAuth from "./RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <Routes>
          <Route path="/" element={<AuthenticationForm />} />

          <Route element={<RequireAuth />}>
            <Route path="/home" element={<AppShellLayout />}>
              <Route element={<HomePage />}>
                <Route index element={<></>} />
                <Route path="meals" element={<Meals />} />
                <Route path="plans" element={<Plans />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </MantineProvider>
    </BrowserRouter>
  );
}
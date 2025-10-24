import "@mantine/core/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.js";
import { AuthenticationForm } from "./AuthenticationForm";
import HomePage from "./HomePage";
import Meals from "./MealsPage";
import Recipes from "./RecipesPage";
import History from "./HistoryPage";
import AppShellLayout from "./AppShellLayout";

export default function App() {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <Routes>
          <Route path="/" element={<AuthenticationForm />} />

          <Route path="/home" element={<AppShellLayout />}>
          <Route element={<HomePage />}>
            <Route index element={<></>} />
            <Route path="meals" element={<Meals />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="history" element={<History />} />
          </Route>
          </Route>
        </Routes>
      </MantineProvider>
    </BrowserRouter>
  );
}
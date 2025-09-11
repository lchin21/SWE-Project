import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.js";

export default function App() {
  return <MantineProvider theme={theme}>App</MantineProvider>;
}
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.js";
import { AuthenticationForm } from "./AuthenticationForm.js";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#404040ff"
        }}
      >
        <AuthenticationForm />
      </div>
    </MantineProvider>
  );
}
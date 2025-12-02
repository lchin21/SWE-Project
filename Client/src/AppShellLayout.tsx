import { AppShell, Group, Title, Badge, Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

export default function AppShellLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
      styles={() => ({
        main: {
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          backgroundColor: "#f4f6fb",
          minHeight: "100vh",
        },
      })}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3}>MyMacroPlan</Title>
          <Group gap="xs">
            <Badge variant="outline">v1</Badge>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="xl" maw={1200} px="md" py="xl" mx="auto">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
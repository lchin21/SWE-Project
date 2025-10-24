import { AppShell, Group, Title, Badge, Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

export default function AppShellLayout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3}>MyMacroPlan</Title>
          <Group gap="xs">
            <Badge variant="outline">v1</Badge>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
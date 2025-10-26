import { SimpleGrid, Card, Title, Text, Progress, Group, Button } from "@mantine/core";

export default function HistoryPage() {
  return (
    <>
      <Group justify="space-between" mb="sm" mt="xs">
        <Title order={4}>History</Title>
        <Button radius="md">View Weekly</Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Card withBorder radius="md" padding="md">
          <Title order={6}>This Week</Title>
          <Text size="sm">Avg 2050 kcal/day</Text>
          <Progress value={88} mt="xs" />
        </Card>
        <Card withBorder radius="md" padding="md">
          <Title order={6}>Last Week</Title>
          <Text size="sm">Avg 1980 kcal/day</Text>
          <Progress value={82} mt="xs" />
        </Card>
      </SimpleGrid>
    </>
  );
}
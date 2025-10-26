import { Group, Title, Button, Card, Stack, Text } from "@mantine/core";

export default function MealsPage() {
  return (
    <>
      <Group justify="space-between" mb="sm" mt="xs">
        <Title order={4}>Meals</Title>
        <Button radius="md">Add Meal</Button>
      </Group>

      <Card withBorder radius="md" padding="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={600}>Breakfast</Text>
            <Text size="sm">430 kcal</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={600}>Lunch</Text>
            <Text size="sm">620 kcal</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={600}>Dinner</Text>
            <Text size="sm">400 kcal</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={600}>Snacks</Text>
            <Text size="sm">0 kcal</Text>
          </Group>
        </Stack>
      </Card>
    </>
  );
}
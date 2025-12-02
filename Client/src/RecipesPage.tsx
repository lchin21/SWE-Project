import { Group, Title, Button, Card, Stack, Text, Badge } from "@mantine/core";

export default function RecipesPage() {
  return (
    <>
      <Group justify="space-between" mb="sm" mt="xs">
        <Title order={4}>Recipes</Title>
        <Button radius="md">Add Recipe</Button>
      </Group>

      <Card withBorder radius="md" padding="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text>Grilled Chicken Bowl</Text>
            <Badge>High Protein</Badge>
          </Group>
          <Group justify="space-between">
            <Text>Overnight Oats</Text>
            <Badge>Breakfast</Badge>
          </Group>
          <Group justify="space-between">
            <Text>Paneer Wrap</Text>
            <Badge>Vegetarian</Badge>
          </Group>
        </Stack>
      </Card>
    </>
  );
}
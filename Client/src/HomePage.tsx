import { useState } from "react";
import { SimpleGrid, Card, Title, Text, Progress, Grid, Stack, Group, Button } from "@mantine/core";

export default function Overview() {
  const [goals, setGoals] = useState({ calories: 2200, protein: 160, carbs: 200, fat: 70 });
  const [today, setToday] = useState({ calories: 1450, protein: 92, carbs: 130, fat: 40 });

  const pct = {
    calories: Math.min(100, Math.round((today.calories / goals.calories) * 100)),
    protein: Math.min(100, Math.round((today.protein / goals.protein) * 100)),
    carbs: Math.min(100, Math.round((today.carbs / goals.carbs) * 100)),
    fat: Math.min(100, Math.round((today.fat / goals.fat) * 100)),
  };

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <Card withBorder padding="md" radius="md">
          <Title order={5}>Calories</Title>
          <Text size="sm">
            {today.calories} / {goals.calories} kcal
          </Text>
          <Progress value={pct.calories} mt="xs" />
        </Card>
        <Card withBorder padding="md" radius="md">
          <Title order={5}>Protein</Title>
          <Text size="sm">
            {today.protein} / {goals.protein} g
          </Text>
          <Progress value={pct.protein} mt="xs" />
        </Card>
        <Card withBorder padding="md" radius="md">
          <Title order={5}>Carbs</Title>
          <Text size="sm">
            {today.carbs} / {goals.carbs} g
          </Text>
          <Progress value={pct.carbs} mt="xs" />
        </Card>
        <Card withBorder padding="md" radius="md">
          <Title order={5}>Fat</Title>
          <Text size="sm">
            {today.fat} / {goals.fat} g
          </Text>
          <Progress value={pct.fat} mt="xs" />
        </Card>
      </SimpleGrid>

      <Grid mt="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder padding="md" radius="md">
            <Title order={5}>Daily Goals</Title>
            <Stack gap="sm" mt="xs">
              <Group justify="space-between">
                <Text>Calories</Text>
                <Group gap="xs">
                  <Text fw={600}>{goals.calories}</Text>
                  <Text size="sm">kcal</Text>
                </Group>
              </Group>
              <Group justify="space-between">
                <Text>Protein</Text>
                <Group gap="xs">
                  <Text fw={600}>{goals.protein}</Text>
                  <Text size="sm">g</Text>
                </Group>
              </Group>
              <Group justify="space-between">
                <Text>Carbs</Text>
                <Group gap="xs">
                  <Text fw={600}>{goals.carbs}</Text>
                  <Text size="sm">g</Text>
                </Group>
              </Group>
              <Group justify="space-between">
                <Text>Fat</Text>
                <Group gap="xs">
                  <Text fw={600}>{goals.fat}</Text>
                  <Text size="sm">g</Text>
                </Group>
              </Group>
              <Group>
                <Button
                  variant="light"
                  onClick={() =>
                    setGoals({ calories: 2300, protein: 170, carbs: 210, fat: 75 })
                  }
                >
                  Set Sample Goals
                </Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder padding="md" radius="md">
            <Title order={5}>Today</Title>
            <Stack gap="sm" mt="xs">
              <Group justify="space-between">
                <Text>Calories</Text>
                <Group gap="xs">
                  <Text fw={600}>{today.calories}</Text>
                  <Text size="sm">kcal</Text>
                </Group>
              </Group>
              <Group justify="space-between">
                <Text>Protein</Text>
                <Group gap="xs">
                  <Text fw={600}>{today.protein}</Text>
                  <Text size="sm">g</Text>
                </Group>
              </Group>
              <Group justify="space-between">
                <Text>Carbs</Text>
                <Group gap="xs">
                  <Text fw={600}>{today.carbs}</Text>
                  <Text size="sm">g</Text>
                </Group>
              </Group>
              <Group justify="space-between">
                <Text>Fat</Text>
                <Group gap="xs">
                  <Text fw={600}>{today.fat}</Text>
                  <Text size="sm">g</Text>
                </Group>
              </Group>
              <Group>
                <Button
                  variant="light"
                  onClick={() =>
                    setToday({ calories: 1800, protein: 120, carbs: 180, fat: 55 })
                  }
                >
                  Set Sample Intake
                </Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
}
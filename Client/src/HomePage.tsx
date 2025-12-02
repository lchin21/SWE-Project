import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Tabs,
  SimpleGrid,
  Card,
  Title,
  Text,
  Progress,
  Grid,
  Stack,
  Group,
  Button,
  Container,
  Box,
  Modal,
  NumberInput,
  Loader,
  SegmentedControl,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { listPlans, getGoals, setGoals as createGoals, updateGoals } from "./apiClient";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const mealSlots = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

type Day = (typeof days)[number];
type MealSlot = (typeof mealSlots)[number];

type PlanEntry = {
  id: number;
  mealID: number;
  mealType: MealSlot;
  meal: {
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  } | null;
};

type WeeklyPlan = Record<Day, Record<MealSlot, PlanEntry | null>>;

const buildEmptyPlan = (): WeeklyPlan => {
  return days.reduce((acc, day) => {
    acc[day] = mealSlots.reduce((slotAcc, slot) => {
      slotAcc[slot] = null;
      return slotAcc;
    }, {} as Record<MealSlot, PlanEntry | null>);
    return acc;
  }, {} as WeeklyPlan);
};

/** Map JS getDay (0=Sun) to our days array (0=Mon) */
const getCurrentDay = (): Day => {
  const jsDay = new Date().getDay();
  // 0=Sun,1=Mon,...6=Sat → shift so Mon=0
  const idx = jsDay === 0 ? 6 : jsDay - 1;
  return days[idx];
};

export default function HomePage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabMap: Record<string, "overview" | "meals" | "plans"> = {
    "/home": "overview",
    "/home/overview": "overview",
    "/home/meals": "meals",
    "/home/plans": "plans",
  };
  const active = tabMap[pathname] || "overview";
  const onTabChange = (value: string | null) => {
    if (!value) return;
    navigate(value === "overview" ? "/home" : `/home/${value}`);
  };

  // Auth state
  const [authReady, setAuthReady] = useState(false);

  // Weekly plan data from backend
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(buildEmptyPlan());
  const [planLoading, setPlanLoading] = useState(true);

  // Current day of the week (today's actual day)
  const currentDay = getCurrentDay();
  
  // Selected day for viewing (user-selectable)
  const [selectedDay, setSelectedDay] = useState<Day>(currentDay);

  // Goals state + tracking whether goals exist in DB
  const [goals, setGoalsState] = useState({ calories: 2200, protein: 160, carbs: 200, fat: 70 });
  const [goalsExist, setGoalsExist] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState({ ...goals });

  // Load goals from backend
  const loadGoals = useCallback(async () => {
    try {
      const data = await getGoals();
      if (data && typeof data.calories === "number") {
        setGoalsState({
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
        });
        setGoalsExist(true);
      }
    } catch {
      // 404 means no goals yet; keep defaults
      setGoalsExist(false);
    }
  }, []);

  // Save goals to backend (create or update)
  const saveGoals = useCallback(async (newGoals: typeof goals) => {
    try {
      if (goalsExist) {
        await updateGoals(newGoals);
      } else {
        await createGoals(newGoals);
        setGoalsExist(true);
      }
      setGoalsState(newGoals);
    } catch (err: any) {
      // If POST fails because goal already exists, try PUT
      if (err?.response?.status === 400) {
        await updateGoals(newGoals);
        setGoalsExist(true);
        setGoalsState(newGoals);
      } else {
        console.error("Failed to save goals", err);
      }
    }
  }, [goalsExist]);

  // Load plans when auth ready
  const loadPlans = useCallback(async () => {
    setPlanLoading(true);
    try {
      const planResponse = await listPlans();
      const template = buildEmptyPlan();
      days.forEach((day) => {
        const dayData = planResponse?.[day] as Record<MealSlot, PlanEntry | null> | undefined;
        mealSlots.forEach((slot) => {
          if (dayData && dayData[slot]) {
            template[day][slot] = dayData[slot];
          }
        });
      });
      setWeeklyPlan(template);
    } catch {
      // silent fail; keep empty plan
    } finally {
      setPlanLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthReady(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authReady) {
      loadPlans();
      loadGoals();
    }
  }, [authReady, loadPlans, loadGoals]);

  // Reload plans when switching to overview tab
  useEffect(() => {
    if (authReady && active === "overview") {
      loadPlans();
    }
  }, [authReady, active, loadPlans]);

  // Derive "today" totals from selected day's plan
  const today = useMemo(() => {
    const slots = weeklyPlan[selectedDay];
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    mealSlots.forEach((slot) => {
      const entry = slots[slot];
      if (entry?.meal) {
        calories += entry.meal.calories || 0;
        protein += entry.meal.protein || 0;
        carbs += entry.meal.carbs || 0;
        fat += entry.meal.fat || 0;
      }
    });
    return { calories, protein, carbs, fat };
  }, [weeklyPlan, selectedDay]);

  const pct = {
    calories: goals.calories > 0 ? Math.min(100, Math.round((today.calories / goals.calories) * 100)) : 0,
    protein: goals.protein > 0 ? Math.min(100, Math.round((today.protein / goals.protein) * 100)) : 0,
    carbs: goals.carbs > 0 ? Math.min(100, Math.round((today.carbs / goals.carbs) * 100)) : 0,
    fat: goals.fat > 0 ? Math.min(100, Math.round((today.fat / goals.fat) * 100)) : 0,
  };
  return (
    <Container size="lg" px="md" maw={1120} mx="auto">
      <Stack gap="lg" align="stretch" w="100%">
        <Tabs
          value={active}
          onChange={onTabChange}
          variant="outline"
          radius="md"
          keepMounted={false}
          w="100%"
          maw={900}
          mx="auto"
          styles={(theme) => ({
            list: {
              width: "100%",
              gap: theme.spacing.sm,
            },
            tab: {
              width: "100%",
              justifyContent: "center",
              minWidth: 0,
              fontWeight: 600,
            },
          })}
        >
          <Tabs.List grow w="100%">
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="meals">Meals</Tabs.Tab>
            <Tabs.Tab value="plans">Week Plan</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {active === "overview" ? (
          <Stack gap="lg" w="100%" maw={900} mx="auto">
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
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

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card withBorder padding="md" radius="md">
                  <Group justify="space-between" align="center">
                    <Title order={5}>Daily Goals</Title>
                    <Button size="xs" variant="outline" onClick={() => { setEditValues({ ...goals }); setEditOpen(true); }}>
                      Edit
                    </Button>
                  </Group>
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
                    {/* Sample goals button removed */}
                  </Stack>
                </Card>
                <Modal opened={editOpen} onClose={() => setEditOpen(false)} title="Edit daily goals" centered>
                  <Stack>
                    <NumberInput
                      label="Calories"
                      min={0}
                      value={editValues.calories}
                      onChange={(v) => setEditValues((s) => ({ ...s, calories: Number(v) || 0 }))}
                    />
                    <NumberInput
                      label="Protein (g)"
                      min={0}
                      value={editValues.protein}
                      onChange={(v) => setEditValues((s) => ({ ...s, protein: Number(v) || 0 }))}
                    />
                    <NumberInput
                      label="Carbs (g)"
                      min={0}
                      value={editValues.carbs}
                      onChange={(v) => setEditValues((s) => ({ ...s, carbs: Number(v) || 0 }))}
                    />
                    <NumberInput
                      label="Fat (g)"
                      min={0}
                      value={editValues.fat}
                      onChange={(v) => setEditValues((s) => ({ ...s, fat: Number(v) || 0 }))}
                    />
                    <Group style={{ justifyContent: "flex-end" }}>
                      <Button
                        onClick={async () => {
                          // basic validation
                          if (editValues.calories <= 0) return;
                          await saveGoals({ ...editValues });
                          setEditOpen(false);
                        }}
                      >
                        Save
                      </Button>
                    </Group>
                  </Stack>
                </Modal>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card withBorder padding="md" radius="md">
                  <Stack gap="sm">
                    <Title order={5}>Select Day</Title>
                    <Group gap={6} justify="center" wrap="wrap">
                      {days.map((day) => (
                        <Tooltip key={day} label={day} offset={-5}>
                          <Button
                            variant={selectedDay === day ? "filled" : "light"}
                            size="xs"
                            onClick={() => setSelectedDay(day)}
                            px={8}
                            py={4}
                            style={{ minWidth: '40px', whiteSpace: 'nowrap' }}
                          >
                            {day.slice(0, 3)}
                          </Button>
                        </Tooltip>
                      ))}
                    </Group>
                    <Text size="sm" c="dimmed" ta="center">
                      Viewing meal data for {selectedDay}
                    </Text>
                  </Stack>
                  {planLoading ? (
                    <Group justify="center" py="sm" mt="md">
                      <Loader size="sm" />
                    </Group>
                  ) : (
                    <Stack gap="sm" mt="md">
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
                    </Stack>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        ) : (
          <Box w="100%" maw={900} mx="auto">
            <Outlet />
          </Box>
        )}
      </Stack>
    </Container>
  );
}
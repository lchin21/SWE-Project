import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  Loader,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { createPlan, deletePlan, listMeals, listPlans } from "./apiClient";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";
import { useNavigate } from "react-router-dom";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const mealSlots = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

type Day = (typeof days)[number];
type MealSlot = (typeof mealSlots)[number];

const buildEmptyPlan = (): WeeklyPlan => {
  return days.reduce((acc, day) => {
    acc[day] = mealSlots.reduce((slotAcc, slot) => {
      slotAcc[slot] = null;
      return slotAcc;
    }, {} as Record<MealSlot, PlanEntry | null>);
    return acc;
  }, {} as WeeklyPlan);
};

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

type MealOption = { value: string; label: string; mealID: number };

export default function PlansPage() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(buildEmptyPlan());
  const [meals, setMeals] = useState<Array<{ mealID: number; name: string; calories: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [clearingDay, setClearingDay] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();

  const mealOptions: MealOption[] = useMemo(
    () =>
      meals.map((meal) => ({
        value: String(meal.mealID),
        mealID: meal.mealID,
        label: `${meal.name} (${meal.calories} kcal)`
      })),
    [meals]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mealResponse, planResponse] = await Promise.all([listMeals(), listPlans()]);
      setMeals(mealResponse || []);
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
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthReady(true);
      } else {
        setAuthReady(false);
        navigate("/", { replace: true });
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (authReady) {
      loadData();
    }
  }, [authReady, loadData]);

  const handleAssign = async (day: Day, slot: MealSlot, mealID: number) => {
    const slotKey = `${day}-${slot}`;
    setSavingSlot(slotKey);
    try {
      await createPlan({ day, mealID, mealType: slot });
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to save plan");
    } finally {
      setSavingSlot((current) => (current === slotKey ? null : current));
    }
  };

  const handleClearSlot = async (entry: PlanEntry | null) => {
    if (!entry) return;
    try {
      await deletePlan(entry.id);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to clear slot");
    }
  };

  const handleClearDay = async (day: Day) => {
    const entries = mealSlots.map((slot) => weeklyPlan[day][slot]).filter(Boolean) as PlanEntry[];
    if (!entries.length) return;
    setClearingDay(day);
    try {
      await Promise.all(entries.map((entry) => deletePlan(entry.id)));
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to clear day");
    } finally {
      setClearingDay((current) => (current === day ? null : current));
    }
  };

  const hasMeals = mealOptions.length > 0;
  const hasAnyEntries = days.some((day) => mealSlots.some((slot) => Boolean(weeklyPlan[day][slot])));

  const handleClearAll = async () => {
    if (!hasAnyEntries) return;
    setClearingAll(true);
    const entries = days.flatMap((day) =>
      mealSlots
        .map((slot) => weeklyPlan[day][slot])
        .filter((entry): entry is PlanEntry => Boolean(entry))
    );

    try {
      await Promise.all(entries.map((entry) => deletePlan(entry.id)));
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to clear week");
    } finally {
      setClearingAll(false);
    }
  };

  if (authChecking) {
    return (
      <Group justify="center" mt="xl">
        <Loader />
      </Group>
    );
  }

  return (
    <Container size="lg" px="md" maw={1100} mx="auto">
      <Stack gap="md" align="center" w="100%">
        <Group justify="space-between" w="100%" maw={900} mt="xs">
          <Title order={4}>Weekly Planner</Title>
          <Button
            variant="light"
            size="xs"
            onClick={handleClearAll}
            disabled={clearingAll || !hasAnyEntries}
          >
            {clearingAll ? "Clearing..." : "Clear week"}
          </Button>
        </Group>

        {error && (
          <Alert color="red" mb="sm" variant="light" w="100%" maw={900}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Group justify="center" mt="xl">
            <Loader />
          </Group>
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            spacing="md"
            w="100%"
            maw={1100}
            mx="auto"
          >
            {days.map((day) => {
              const dayHasEntries = mealSlots.some((slot) => weeklyPlan[day][slot]);
              return (
                <Card
                  withBorder
                  radius="md"
                  padding="md"
                  key={day}
                  w="100%"
                  maw={280}
                  mx="auto"
                >
                  <Group justify="space-between" mb="sm">
                    <Title order={5}>{day}</Title>
                    <Button
                      variant="subtle"
                      size="xs"
                      disabled={!dayHasEntries || clearingDay === day}
                      onClick={() => handleClearDay(day)}
                    >
                      {clearingDay === day ? "Clearing..." : "Clear"}
                    </Button>
                  </Group>

                  <Stack gap="xs">
                    {mealSlots.map((slot) => {
                      const entry = weeklyPlan[day][slot];
                      const slotKey = `${day}-${slot}`;
                      return (
                        <Menu withinPortal shadow="md" key={slotKey} position="bottom-start">
                          <Menu.Target>
                            <Button
                              variant={entry ? "light" : "default"}
                              fullWidth
                              radius="md"
                              disabled={savingSlot === slotKey}
                              styles={(theme) => ({
                                root: {
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                  paddingTop: theme.spacing.sm,
                                  paddingBottom: theme.spacing.sm,
                                  paddingLeft: theme.spacing.sm,
                                  paddingRight: theme.spacing.sm,
                                  minHeight: 84,
                                  backgroundColor: entry
                                    ? theme.colors.blue?.[0] || "#e3f2fd"
                                    : theme.colors.gray?.[0] || "#f8f9fa",
                                  borderColor: theme.colors.gray?.[3] || "#dee2e6",
                                  borderWidth: 1,
                                  borderStyle: "solid",
                                  boxShadow: "none",
                                  color: theme.black,
                                  overflow: "visible",
                                },
                              })}
                            >
                              <Stack gap={4} align="flex-start">
                                <Text size="xs" c="dimmed">
                                  {slot}
                                </Text>
                                <Group gap="xs" wrap="nowrap">
                                  {savingSlot === slotKey ? (
                                    <Loader size="xs" />
                                  ) : (
                                    <Text fw={500}>
                                      {entry?.meal?.name || "Select meal"}
                                    </Text>
                                  )}
                                </Group>
                                {entry?.meal && (
                                  <Text size="xs" c="dimmed">
                                    {entry.meal.calories} kcal
                                  </Text>
                                )}
                              </Stack>
                            </Button>
                          </Menu.Target>
                          <Menu.Dropdown>
                            {hasMeals ? (
                              mealOptions.map((option) => (
                                <Menu.Item
                                  key={option.mealID}
                                  onClick={() => handleAssign(day, slot, option.mealID)}
                                >
                                  {option.label}
                                </Menu.Item>
                              ))
                            ) : (
                              <Menu.Item disabled>
                                Save meals first to plan your week
                              </Menu.Item>
                            )}
                            {entry && (
                              <>
                                <Menu.Divider />
                                <Menu.Item color="red" onClick={() => handleClearSlot(entry)}>
                                  Clear {slot}
                                </Menu.Item>
                              </>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      );
                    })}
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}

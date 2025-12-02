import {
  Container,
  Group,
  Title,
  Button,
  Card,
  Stack,
  Text,
  Loader,
  Modal,
  TextInput,
  NumberInput,
  SimpleGrid,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "@mantine/form";
import { createMeal, deleteMealById, listMeals, updateMeal } from "./apiClient";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";
import { useNavigate } from "react-router-dom";

type MealInfo = {
  mealID: number;
  name: string;
  calories: number;
  protein?: number;
  fat?: number;
  carbs?: number;
};

export default function MealsPage() {
  const [meals, setMeals] = useState<MealInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    },
    validate: {
      name: (value) => (value.trim().length === 0 ? "Name is required" : null),
    },
  });

  const loadMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMeals();
      setMeals(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Failed to load meals");
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
      loadMeals();
    }
  }, [authReady, loadMeals]);

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: values.name.trim(),
        calories: Number(values.calories) || 0,
        protein: Number(values.protein) || 0,
        fat: Number(values.fat) || 0,
        carbs: Number(values.carbs) || 0,
      };

      if (mode === "edit" && selectedMealId) {
        await updateMeal(selectedMealId, payload);
      } else {
        await createMeal(payload);
      }
      close();
      form.reset();
      setMode("create");
      setSelectedMealId(null);
      await loadMeals();
    } catch (e: any) {
      setSubmitError(e?.response?.data?.message || e.message || "Failed to save meal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMealId) return;
    setDeleting(true);
    setSubmitError(null);
    try {
      await deleteMealById(selectedMealId);
      close();
      form.reset();
      setSelectedMealId(null);
      setMode("create");
      await loadMeals();
    } catch (e: any) {
      setSubmitError(e?.response?.data?.message || e.message || "Failed to delete meal");
    } finally {
      setDeleting(false);
    }
  };

  const openForCreate = () => {
    setMode("create");
    setSelectedMealId(null);
    form.reset();
    open();
  };

  const openForEdit = (meal: typeof meals[number]) => {
    setMode("edit");
    setSelectedMealId(meal.mealID);
    form.setValues({
      name: meal.name,
      calories: meal.calories || 0,
      protein: (meal as any).protein || 0,
      fat: (meal as any).fat || 0,
      carbs: (meal as any).carbs || 0,
    });
    open();
  };

  if (authChecking) {
    return (
      <Group justify="center" mt="xl">
        <Loader />
      </Group>
    );
  }

  return (
    <Container size="lg" px="md" maw={1000} mx="auto">
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setMode("create");
          setSelectedMealId(null);
          form.reset();
          setSubmitError(null);
        }}
        title={mode === "edit" ? "Edit meal" : "Add meal"}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              withAsterisk
              label="Meal name"
              placeholder="e.g. Grilled Chicken"
              {...form.getInputProps("name")}
            />
            <NumberInput label="Calories" min={0} {...form.getInputProps("calories")} />
            <NumberInput label="Protein (g)" min={0} {...form.getInputProps("protein")} />
            <NumberInput label="Carbs (g)" min={0} {...form.getInputProps("carbs")} />
            <NumberInput label="Fat (g)" min={0} {...form.getInputProps("fat")} />
            {submitError && (
              <Text size="sm" c="red">
                {submitError}
              </Text>
            )}
            <Group justify="space-between" align="center">
              <Button type="submit" loading={submitting} disabled={submitting}>
                {mode === "edit" ? "Save changes" : "Save meal"}
              </Button>
              {mode === "edit" && (
                <Button
                  type="button"
                  color="red"
                  variant="light"
                  onClick={handleDelete}
                  loading={deleting}
                  disabled={deleting}
                >
                  Delete
                </Button>
              )}
            </Group>
          </Stack>
        </form>
      </Modal>

      <Stack gap="md" align="center" w="100%">
        <Group justify="space-between" w="100%" maw={720} mt="xs">
          <Title order={4}>Meals</Title>
          <Button radius="md" onClick={openForCreate}>
            Add Meal
          </Button>
        </Group>

        <Card withBorder radius="md" padding="md" w="100%" maw={720} shadow="sm">
          {loading ? (
            <Loader size="sm" />
          ) : error ? (
            <Text c="red" size="sm">
              {error}
            </Text>
          ) : (
            <>
              {meals.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No meals yet.
                </Text>
              ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
                  {meals.map((m) => (
                    <Card
                      key={m.mealID}
                      withBorder
                      radius="md"
                      padding="md"
                      shadow="xs"
                      onClick={() => openForEdit(m)}
                      style={{ cursor: "pointer" }}
                    >
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <Stack gap={2}>
                          <Text fw={600}>{m.name}</Text>
                          <Text size="xs" c="dimmed">
                            {m.calories} kcal
                          </Text>
                          <Group gap="xs">
                            <Text size="xs" c="dimmed">
                              P: {m.protein ?? 0}g
                            </Text>
                            <Text size="xs" c="dimmed">
                              C: {m.carbs ?? 0}g
                            </Text>
                            <Text size="xs" c="dimmed">
                              F: {m.fat ?? 0}g
                            </Text>
                          </Group>
                        </Stack>
                        <Text size="sm" c="blue">
                          Edit
                        </Text>
                      </Group>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
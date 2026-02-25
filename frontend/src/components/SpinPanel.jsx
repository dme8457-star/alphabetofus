import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconAlertCircle, IconDice5, IconSparkles } from "@tabler/icons-react";

export default function SpinPanel({ ideas = [], onSpin, isLoading }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [rouletteText, setRouletteText] = useState("");
  const timerRef = useRef(null);

  const availableIdeas = useMemo(() => ideas.filter((i) => !i.used), [ideas]);

  const eligibleLetters = useMemo(() => {
    const counts = new Map();
    for (const idea of availableIdeas) {
      counts.set(idea.letter, (counts.get(idea.letter) || 0) + 1);
    }

    return [...counts.entries()]
      .filter(([, count]) => count > 1)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, count]) => ({
        value: letter,
        label: `${letter} (${count} ideas)`,
      }));
  }, [availableIdeas]);

  const previewsForLetter = useMemo(() => {
    if (!selectedLetter) return [];
    return availableIdeas.filter((i) => i.letter === selectedLetter);
  }, [availableIdeas, selectedLetter]);

  useEffect(() => {
    if (!eligibleLetters.length) {
      setSelectedLetter(null);
      return;
    }

    if (!selectedLetter || !eligibleLetters.some((l) => l.value === selectedLetter)) {
      setSelectedLetter(eligibleLetters[0].value);
    }
  }, [eligibleLetters, selectedLetter]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function handleSpin() {
    setError("");
    setResult(null);

    if (!selectedLetter) {
      setError("Elige una letra con al menos 2 ideas disponibles.");
      return;
    }

    if (previewsForLetter.length < 2) {
      setError("Esa letra necesita al menos 2 ideas disponibles.");
      return;
    }

    let ticks = 0;
    timerRef.current = setInterval(() => {
      const candidate = previewsForLetter[ticks % previewsForLetter.length];
      setRouletteText(candidate?.description || "");
      ticks += 1;
    }, 90);

    try {
      const chosen = await onSpin(selectedLetter);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (!chosen?.id) {
        setRouletteText("");
        setError("No hay ideas disponibles para esa letra.");
        return;
      }

      setRouletteText(chosen.description);
      setResult(chosen);
    } catch (e) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRouletteText("");
      setError(e.message || "Error al girar");
    }
  }

  return (
    <Paper withBorder radius="lg" p="md" shadow="xs">
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap" align="flex-end">
          <div>
            <Text fw={700}>Ruleta por letra</Text>
            <Text size="sm" c="rgba(234,241,255,0.72)">
              Elige una letra con varias ideas y sorteamos una al azar.
            </Text>
          </div>

          <Group gap="sm" wrap="wrap">
            <Select
              placeholder="Letra"
              data={eligibleLetters}
              value={selectedLetter}
              onChange={setSelectedLetter}
              w={200}
              disabled={!eligibleLetters.length || isLoading}
            />
            <Button
              onClick={handleSpin}
              loading={isLoading}
              leftSection={<IconDice5 size={16} />}
              radius="md"
              disabled={!eligibleLetters.length || !selectedLetter}
            >
              {isLoading ? "Girando..." : "Girar"}
            </Button>
          </Group>
        </Group>

        {!eligibleLetters.length ? (
          <Alert
            color="blue"
            variant="light"
            styles={{
              root: { background: "rgba(0, 86, 170, 0.18)", borderColor: "rgba(66, 160, 255, 0.22)" },
              message: { color: "#fff" },
              icon: { color: "#fff" },
            }}
          >
            La ruleta se activa cuando una letra tiene 2 o mas ideas disponibles.
          </Alert>
        ) : (
          <Paper
            radius="lg"
            p="md"
            withBorder
            style={{
              background:
                "linear-gradient(135deg, rgba(0,136,255,0.12), rgba(9,15,32,0.22) 55%, rgba(66,245,255,0.10))",
            }}
          >
            <Stack gap="xs">
              <Group gap="xs">
                <Badge color="blue" variant="filled" radius="sm">
                  {selectedLetter || "-"}
                </Badge>
                <Badge color="cyan" variant="light" radius="sm">
                  Modo casino
                </Badge>
              </Group>

              <Paper
                withBorder
                radius="md"
                p="sm"
                style={{
                  minHeight: 56,
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(4, 8, 16, 0.45)",
                  borderColor: "rgba(66, 160, 255, 0.18)",
                }}
              >
                <Text fw={600} c={rouletteText ? "white" : "rgba(234,241,255,0.6)"}>
                  {rouletteText || "Pulsa Girar para iniciar el sorteo"}
                </Text>
              </Paper>
            </Stack>
          </Paper>
        )}

        {result ? (
          <Paper
            radius="lg"
            p="md"
            withBorder
            style={{
              background:
                "linear-gradient(135deg, rgba(0,136,255,0.12), rgba(9,15,32,0.18) 55%, rgba(66,245,255,0.09))",
            }}
          >
            <Group align="flex-start" wrap="nowrap">
              <ThemeIcon size={42} radius="md" color="blue">
                <IconSparkles size={20} />
              </ThemeIcon>
              <div style={{ flex: 1 }}>
                <Group gap="xs">
                  <Badge color="blue" variant="filled" radius="sm">
                    {result.letter}
                  </Badge>
                  <Badge color="cyan" variant="light" radius="sm">
                    Elegida
                  </Badge>
                </Group>
                <Text fw={700} size="lg" mt={8}>
                  {result.description}
                </Text>
              </div>
            </Group>
          </Paper>
        ) : null}

        {error ? (
          <Alert
            color="red"
            variant="light"
            icon={<IconAlertCircle size={16} />}
            styles={{
              root: { background: "rgba(120, 14, 34, 0.28)", borderColor: "rgba(255, 99, 132, 0.28)" },
              message: { color: "#fff" },
              icon: { color: "#fff" },
            }}
          >
            {error}
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}

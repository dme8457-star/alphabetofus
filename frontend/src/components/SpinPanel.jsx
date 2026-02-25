import { useState } from "react";
import { Alert, Badge, Button, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconAlertCircle, IconDice5, IconSparkles } from "@tabler/icons-react";

export default function SpinPanel({ onSpin, isLoading }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSpin() {
    setError("");
    try {
      const chosen = await onSpin();
      if (!chosen?.id) {
        setResult(null);
        setError("No hay ideas disponibles. Agrega mas ideas.");
        return;
      }
      setResult(chosen);
    } catch (e) {
      setError(e.message || "Error al girar");
    }
  }

  return (
    <Paper withBorder radius="lg" p="md" shadow="xs">
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap">
          <div>
            <Text fw={700}>Ruleta</Text>
            <Text size="sm" c="dimmed">
              Elige una idea disponible al azar de la sala.
            </Text>
          </div>

          <Button onClick={handleSpin} loading={isLoading} leftSection={<IconDice5 size={16} />} radius="md">
            {isLoading ? "Girando..." : "Girar"}
          </Button>
        </Group>

        {result ? (
          <Paper
            radius="lg"
            p="md"
            withBorder
            style={{
              background:
                "linear-gradient(135deg, rgba(18,184,134,0.07), rgba(250,176,5,0.08) 55%, rgba(34,139,230,0.07))",
            }}
          >
            <Group align="flex-start" wrap="nowrap">
              <ThemeIcon size={42} radius="md" color="teal">
                <IconSparkles size={20} />
              </ThemeIcon>
              <div style={{ flex: 1 }}>
                <Group gap="xs">
                  <Badge color="teal" variant="filled" radius="sm">
                    {result.letter}
                  </Badge>
                  <Badge color="green" variant="light" radius="sm">
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
          <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />}>
            {error}
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}

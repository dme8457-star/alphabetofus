import { useMemo, useState } from "react";
import { Alert, Button, Group, Paper, Stack, Text, TextInput } from "@mantine/core";
import { IconAlertCircle, IconBulb, IconHash, IconPlus } from "@tabler/icons-react";
import { z } from "zod";

const schema = z.object({
  letter: z.string().length(1).regex(/^[A-Za-z]$/),
  description: z.string().min(1).max(500),
});

export default function IdeaForm({ onAdd, isLoading }) {
  const [letter, setLetter] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => letter.trim() && description.trim(), [letter, description]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const dto = { letter: letter.trim(), description: description.trim() };
    const parsed = schema.safeParse(dto);

    if (!parsed.success) {
      setError("La letra debe ser A-Z y la descripcion es obligatoria.");
      return;
    }

    await onAdd({ letter: dto.letter.toUpperCase(), description: dto.description });
    setLetter("");
    setDescription("");
  }

  return (
    <Paper withBorder radius="lg" p="md" shadow="xs">
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <div>
            <Text fw={700}>Agregar idea</Text>
            <Text size="sm" c="dimmed">
              Agrega una letra a la vez. Mantenla corta y especifica.
            </Text>
          </div>

          <Group align="flex-end" wrap="wrap">
            <TextInput
              label="Letra"
              placeholder="A"
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              maxLength={1}
              w={92}
              leftSection={<IconHash size={15} />}
            />

            <TextInput
              label="Idea"
              placeholder="Noche de arcade, picnic en la playa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ flex: 1, minWidth: 220 }}
              leftSection={<IconBulb size={15} />}
            />

            <Button
              type="submit"
              loading={isLoading}
              disabled={!canSubmit || isLoading}
              leftSection={<IconPlus size={16} />}
            >
              Agregar
            </Button>
          </Group>

          {error ? (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />}>
              {error}
            </Alert>
          ) : null}
        </Stack>
      </form>
    </Paper>
  );
}

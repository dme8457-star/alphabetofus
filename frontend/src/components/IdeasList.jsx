import { Badge, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconBulb, IconClock } from "@tabler/icons-react";

export default function IdeasList({ ideas }) {
  return (
    <Paper withBorder radius="lg" p="md" shadow="xs">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <div>
            <Text fw={700}>Ideas</Text>
            <Text size="sm" c="dimmed">
              {ideas?.length ? `${ideas.length} guardadas` : "Aun no hay ideas. Agrega la primera."}
            </Text>
          </div>
          <Badge color="teal" variant="light">
            Lista A-Z
          </Badge>
        </Group>

        {!ideas?.length ? null : (
          <Stack gap="xs">
            {ideas.map((i) => (
              <Paper key={i.id} withBorder radius="md" p="sm" bg={i.used ? "gray.0" : "white"}>
                <Group justify="space-between" align="flex-start" wrap="wrap">
                  <Group align="flex-start" wrap="nowrap" style={{ flex: 1, minWidth: 220 }}>
                    <ThemeIcon color={i.used ? "gray" : "teal"} variant={i.used ? "light" : "filled"} radius="md">
                      <IconBulb size={16} />
                    </ThemeIcon>

                    <div style={{ flex: 1 }}>
                      <Group gap="xs">
                        <Badge color={i.used ? "gray" : "teal"} variant="light" radius="sm">
                          {i.letter}
                        </Badge>
                        {i.used ? (
                          <Badge color="gray" variant="dot" radius="sm">
                            Usada
                          </Badge>
                        ) : (
                          <Badge color="green" variant="dot" radius="sm">
                            Disponible
                          </Badge>
                        )}
                      </Group>
                      <Text mt={6}>{i.description}</Text>
                    </div>
                  </Group>

                  <Group gap={6} c="dimmed" wrap="nowrap">
                    <IconClock size={14} />
                    <Text size="xs">{new Date(i.createdAt).toLocaleString()}</Text>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

import { Badge, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconBulb, IconClock } from "@tabler/icons-react";

export default function IdeasList({ ideas, highlightIdeaId }) {
  return (
    <Paper withBorder radius="lg" p="md" shadow="xs">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <div>
            <Text fw={700}>Ideas</Text>
            <Text size="sm" c="rgba(234,241,255,0.72)">
              {ideas?.length ? `${ideas.length} guardadas` : "Aun no hay ideas. Agrega la primera."}
            </Text>
          </div>
          <Badge color="blue" variant="light">
            Lista A-Z
          </Badge>
        </Group>

        {!ideas?.length ? null : (
          <Stack gap="xs">
            {ideas.map((i) => {
              const isHighlighted = i.id === highlightIdeaId;
              return (
              <Paper
                key={i.id}
                withBorder
                radius="md"
                p="sm"
                bg={i.used ? "dark.6" : "dark.5"}
                style={
                  isHighlighted
                    ? {
                        borderColor: "rgba(66,245,255,0.45)",
                        boxShadow: "0 0 0 1px rgba(66,245,255,0.18) inset",
                      }
                    : undefined
                }
              >
                <Group justify="space-between" align="flex-start" wrap="wrap">
                  <Group align="flex-start" wrap="nowrap" style={{ flex: 1, minWidth: 220 }}>
                    <ThemeIcon color={i.used ? "gray" : "blue"} variant={i.used ? "light" : "filled"} radius="md">
                      <IconBulb size={16} />
                    </ThemeIcon>

                    <div style={{ flex: 1 }}>
                      <Group gap="xs">
                        <Badge color={i.used ? "gray" : "blue"} variant="light" radius="sm">
                          {i.letter}
                        </Badge>
                        {i.used ? (
                          <Badge color="gray" variant="dot" radius="sm">
                            Usada
                          </Badge>
                        ) : (
                          <Badge color="cyan" variant="dot" radius="sm">
                            Disponible
                          </Badge>
                        )}
                        {isHighlighted ? (
                          <Badge color="cyan" variant="filled" radius="sm">
                            Ultima elegida
                          </Badge>
                        ) : null}
                      </Group>
                      <Text mt={6}>{i.description}</Text>
                    </div>
                  </Group>

                  <Group gap={6} c="rgba(234,241,255,0.66)" wrap="nowrap">
                    <IconClock size={14} />
                    <Text size="xs">{new Date(i.createdAt).toLocaleString()}</Text>
                  </Group>
                </Group>
              </Paper>
            )})}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

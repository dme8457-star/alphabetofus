import { ActionIcon, Badge, Button, Group, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";
import { IconCheck, IconCopy, IconLogout } from "@tabler/icons-react";

export default function RoomHeader({ roomName, roomCode, onLogout }) {
  const clipboard = useClipboard({ timeout: 1200 });

  function handleCopyCode() {
    clipboard.copy(roomCode);
    notifications.show({
      title: "código copiado",
      message: `${roomCode} copiado al portapapeles`,
      color: "teal",
    });
  }

  return (
    <Paper withBorder radius="lg" p="md" shadow="xs">
      <Group justify="space-between" align="center" wrap="wrap">
        <Stack gap={4}>
          <Text fw={800} size="lg">
            {roomName}
          </Text>
          <Group gap="xs">
            <Badge color="teal" variant="light" radius="sm">
              código: {roomCode}
            </Badge>
            <Tooltip label={clipboard.copied ? "Copiado" : "Copiar código"}>
              <ActionIcon variant="subtle" color={clipboard.copied ? "teal" : "gray"} onClick={handleCopyCode}>
                {clipboard.copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>

        <Button variant="light" color="gray" leftSection={<IconLogout size={16} />} onClick={onLogout}>
          Salir
        </Button>
      </Group>
    </Paper>
  );
}

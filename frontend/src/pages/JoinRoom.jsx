import { useState } from "react";
import {
  Alert,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconDoorEnter,
  IconHash,
  IconLock,
} from "@tabler/icons-react";
import Layout from "../components/Layout";
import { joinRoom } from "../api/au/roomsApi";
import { setToken } from "../auth/tokenStorage";

export default function JoinRoom({ onDone, onBack }) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token } = await joinRoom({
        code: code.trim(),
        password: password.trim() || undefined,
      });

      setToken(token);
      notifications.show({
        title: "Conectado",
        message: "Te uniste a la sala correctamente.",
        color: "teal",
      });

      onDone();
    } catch (err) {
      const message = err.message || "No se pudo unir a la sala.";
      setError(message);
      notifications.show({
        title: "Error al unirse",
        message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Unirse a una sala" subtitle="Usa el código de la sala y la contraseña opcional para continuar.">
      <form onSubmit={handleJoin}>
        <Stack gap="md">
          <TextInput
            label="código de sala"
            placeholder="ABCD1234"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            leftSection={<IconHash size={16} />}
            required
          />

          <PasswordInput
            label="contraseña (opcional)"
            placeholder="Ingresa la contraseña si aplica"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftSection={<IconLock size={16} />}
          />

          <Text size="sm" c="dimmed">
            Solo personas con el código (y contraseña, si existe) pueden entrar a esta sala.
          </Text>

          {error ? (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />}>
              {error}
            </Alert>
          ) : null}

          <Group justify="space-between" mt="xs">
            <Button variant="subtle" onClick={onBack} type="button" leftSection={<IconArrowLeft size={16} />}>
              Volver
            </Button>

            <Button type="submit" loading={loading} disabled={!code.trim()} leftSection={<IconDoorEnter size={16} />}>
              Unirse a sala
            </Button>
          </Group>
        </Stack>
      </form>
    </Layout>
  );
}

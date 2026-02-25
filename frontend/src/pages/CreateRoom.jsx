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
  IconLock,
  IconPlus,
  IconSignature,
} from "@tabler/icons-react";
import Layout from "../components/Layout";
import { createRoom } from "../api/au/roomsApi";
import { setToken } from "../auth/tokenStorage";

export default function CreateRoom({ onDone, onBack }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token } = await createRoom({ name: name.trim(), password: password.trim() || undefined });
      setToken(token);
      notifications.show({
        title: "Sala creada",
        message: "Tu sala esta lista. Ya quedaste conectado.",
        color: "blue",
      });
      onDone();
    } catch (err) {
      const message = err.message || "No se pudo crear la sala";
      setError(message);
      notifications.show({
        title: "Error al crear",
        message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Crear una sala" subtitle="Dale un nombre a tu sala y opcionalmente protegela con contraseña.">
      <form onSubmit={handleCreate}>
        <Stack gap="md">
          <TextInput
            label="Nombre de la sala"
            placeholder="Planes del viernes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftSection={<IconSignature size={16} />}
            required
          />

          <PasswordInput
            label="contraseña (opcional)"
            placeholder="Agrega una contraseña para privacidad"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftSection={<IconLock size={16} />}
          />

          <Text size="sm" c="dimmed">
            Puedes compartir el código generado con tu pareja o grupo despues de crearla.
          </Text>

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

          <Group justify="space-between">
            <Button
              type="button"
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={onBack}
            >
              Volver
            </Button>
            <Button type="submit" loading={loading} disabled={!name.trim()} leftSection={<IconPlus size={16} />}>
              Crear sala
            </Button>
          </Group>
        </Stack>
      </form>
    </Layout>
  );
}

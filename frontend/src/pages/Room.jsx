import { useEffect, useState } from "react";
import { Alert, Badge, Button, Center, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import Layout from "../components/Layout";
import RoomHeader from "../components/RoomHeader";
import IdeaForm from "../components/IdeaForm";
import IdeasList from "../components/IdeasList";
import SpinPanel from "../components/SpinPanel";
import { addIdea, getMyRoom, spin } from "../api/au/roomsApi";
import { clearToken } from "../auth/tokenStorage";

export default function Room({ onLogout }) {
  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [loadingIdea, setLoadingIdea] = useState(false);
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [error, setError] = useState("");
  const [lastPicked, setLastPicked] = useState(null);

  async function loadRoom() {
    setError("");
    setLoadingRoom(true);
    try {
      const data = await getMyRoom();
      setRoom(data);
    } catch (e) {
      setError(e.message || "No se pudo cargar la sala");
    } finally {
      setLoadingRoom(false);
    }
  }

  useEffect(() => {
    loadRoom();
  }, []);

  async function handleLogout() {
    clearToken();
    onLogout();
  }

  async function handleAddIdea(dto) {
    setLoadingIdea(true);
    setError("");
    try {
      await addIdea(dto);
      await loadRoom();
      notifications.show({
        title: "Idea agregada",
        message: `${dto.letter.toUpperCase()} - ${dto.description}`,
        color: "blue",
      });
    } catch (e) {
      const message = e.message || "No se pudo agregar la idea";
      setError(message);
      notifications.show({ title: "No se pudo agregar la idea", message, color: "red" });
    } finally {
      setLoadingIdea(false);
    }
  }

  async function handleSpin(letter) {
    setLoadingSpin(true);
    setError("");
    try {
      const chosen = await spin(letter);
      setLastPicked(chosen?.id ? chosen : null);
      await loadRoom();
      return chosen;
    } catch (e) {
      const message = e.message || "Error al girar";
      setError(message);
      throw e;
    } finally {
      setLoadingSpin(false);
    }
  }

  if (loadingRoom) {
    return (
      <Layout title="Sala" subtitle="Cargando tus ideas y detalles de la sala...">
        <Center py="xl">
          <Loader color="blue" />
        </Center>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout title="Sala" subtitle="No se pudo cargar la sesion actual de la sala.">
        <Stack gap="md">
          <Alert
            color="red"
            icon={<IconAlertCircle size={16} />}
            variant="light"
            styles={{
              root: { background: "rgba(120, 14, 34, 0.28)", borderColor: "rgba(255, 99, 132, 0.28)" },
              message: { color: "#fff" },
              icon: { color: "#fff" },
            }}
          >
            {error || "No hay datos de la sala"}
          </Alert>
          <Button onClick={handleLogout} variant="subtle" leftSection={<IconArrowLeft size={16} />}>
            Volver
          </Button>
        </Stack>
      </Layout>
    );
  }

  return (
    <Layout title="Alphabet of us" subtitle="Crea tu banco de ideas A-Z y gira para elegir el siguiente plan.">
      <Stack gap="md">
        <RoomHeader roomName={room.name} roomCode={room.code} onLogout={handleLogout} />

        {error ? (
          <Alert
            color="red"
            icon={<IconAlertCircle size={16} />}
            variant="light"
            styles={{
              root: { background: "rgba(120, 14, 34, 0.28)", borderColor: "rgba(255, 99, 132, 0.28)" },
              message: { color: "#fff" },
              icon: { color: "#fff" },
            }}
          >
            {error}
          </Alert>
        ) : null}

        <IdeaForm onAdd={handleAddIdea} isLoading={loadingIdea} />

        <SpinPanel ideas={room.ideas || []} onSpin={handleSpin} isLoading={loadingSpin} />

        {lastPicked ? (
          <Paper
            withBorder
            radius="lg"
            p="md"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,136,255,0.12), rgba(9,15,32,0.18) 55%, rgba(66,245,255,0.09))",
            }}
          >
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <div>
                <Text fw={700}>Ultima eleccion aleatoria</Text>
                <Text c="rgba(234,241,255,0.72)" size="sm">
                  Resultado del ultimo giro para ubicarlo rapido en la lista
                </Text>
              </div>
              <Group gap="xs">
                <Badge color="blue" variant="filled">{lastPicked.letter}</Badge>
                <Badge color="cyan" variant="light">Elegida</Badge>
              </Group>
            </Group>
            <Text mt="sm" fw={600}>
              {lastPicked.description}
            </Text>
          </Paper>
        ) : null}

        <IdeasList ideas={room.ideas} highlightIdeaId={lastPicked?.id} />
      </Stack>
    </Layout>
  );
}

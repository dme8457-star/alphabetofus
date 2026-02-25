import { useEffect, useState } from "react";
import { Alert, Button, Center, Loader, Stack } from "@mantine/core";
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
        color: "teal",
      });
    } catch (e) {
      const message = e.message || "No se pudo agregar la idea";
      setError(message);
      notifications.show({ title: "No se pudo agregar la idea", message, color: "red" });
    } finally {
      setLoadingIdea(false);
    }
  }

  async function handleSpin() {
    setLoadingSpin(true);
    setError("");
    try {
      const chosen = await spin();
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
          <Loader color="teal" />
        </Center>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout title="Sala" subtitle="No se pudo cargar la sesion actual de la sala.">
        <Stack gap="md">
          <Alert color="red" icon={<IconAlertCircle size={16} />} variant="light">
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
    <Layout title="Alphabet Date" subtitle="Crea tu banco de ideas A-Z y gira para elegir el siguiente plan.">
      <Stack gap="md">
        <RoomHeader roomName={room.name} roomCode={room.code} onLogout={handleLogout} />

        {error ? (
          <Alert color="red" icon={<IconAlertCircle size={16} />} variant="light">
            {error}
          </Alert>
        ) : null}

        <IdeaForm onAdd={handleAddIdea} isLoading={loadingIdea} />

        <SpinPanel onSpin={handleSpin} isLoading={loadingSpin} />

        <IdeasList ideas={room.ideas} />
      </Stack>
    </Layout>
  );
}

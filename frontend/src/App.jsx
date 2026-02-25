import { useState } from "react";
import {
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconDoorEnter, IconPlus, IconSparkles } from "@tabler/icons-react";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import Layout from "./components/Layout";
import { getToken, clearToken } from "./auth/tokenStorage";

function HomeActionCard({ title, description, icon, buttonText, onClick, variant = "light" }) {
  return (
    <Paper
      withBorder
      radius="lg"
      p="lg"
      shadow="xs"
      style={{
        background: "linear-gradient(180deg, rgba(9,12,22,0.92), rgba(6,9,18,0.9))",
        borderColor: "rgba(0,136,255,0.28)",
      }}
    >
      <Stack gap="sm">
        <ThemeIcon size={42} radius="md" variant={variant}>
          {icon}
        </ThemeIcon>
        <div>
          <Text fw={700} size="lg" c="white">
            {title}
          </Text>
          <Text c="rgba(234,241,255,0.78)" size="sm" mt={4}>
            {description}
          </Text>
        </div>
        <Button onClick={onClick} radius="md" color="blue" variant="light">
          {buttonText}
        </Button>
      </Stack>
    </Paper>
  );
}

export default function App() {
  const [view, setView] = useState(getToken() ? "room" : "home");

  function goRoom() {
    setView("room");
  }

  function goHome() {
    setView("home");
  }

  function logout() {
    clearToken();
    setView("home");
  }

  if (view === "room") {
    return <Room onLogout={logout} />;
  }

  if (view === "create") {
    return <CreateRoom onDone={goRoom} onBack={goHome} />;
  }

  if (view === "join") {
    return <JoinRoom onDone={goRoom} onBack={goHome} />;
  }

  return (
    <Layout
      title="ALPHABET OF US"
      subtitle="Salas privadas para guardar ideas de citas A-Z y luego girar una ruleta para elegir el siguiente plan."
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Badge radius="sm" color="blue" variant="light" leftSection={<IconSparkles size={14} />}>
            Inicio rapido
          </Badge>
          <Text c="dimmed" size="sm">
            código de sala + contraseña opcional
          </Text>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <HomeActionCard
            title="Crear sala"
            description="Crea una sala nueva, comparte el código y empiecen a guardar ideas de citas."
            icon={<IconPlus size={22} />}
            buttonText="Crear sala"
            onClick={() => setView("create")}
            variant="filled"
          />
          <HomeActionCard
            title="Unirse a sala"
            description="Ingresa el código de una sala existente y sigue agregando ideas o girando."
            icon={<IconDoorEnter size={22} />}
            buttonText="Unirse a sala"
            onClick={() => setView("join")}
            variant="filled"
          />
        </SimpleGrid>
      </Stack>
    </Layout>
  );
}

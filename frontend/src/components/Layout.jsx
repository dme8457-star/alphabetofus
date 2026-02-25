import { Box, Container, Paper, Stack, Text, Title } from "@mantine/core";

export default function Layout({ title, subtitle, children }) {
  return (
    <Container size="lg" py={{ base: 20, sm: 36 }}>
      <Paper
        withBorder
        radius="xl"
        p={{ base: "md", sm: "xl" }}
        shadow="sm"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, rgba(10,14,24,0.92), rgba(8,12,22,0.86))",
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 100% 0%, rgba(0,136,255,0.18), transparent 34%), radial-gradient(circle at 0% 100%, rgba(66,245,255,0.12), transparent 32%)",
          }}
        />

        <Stack gap="lg" style={{ position: "relative" }}>
          <div>
            <Title order={1} fz={{ base: 28, sm: 34 }} lh={1.05}>
              {title}
            </Title>
            {subtitle ? (
              <Text c="rgba(234,241,255,0.72)" mt={6}>
                {subtitle}
              </Text>
            ) : null}
          </div>

          {children}
        </Stack>
      </Paper>
    </Container>
  );
}

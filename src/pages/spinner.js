import { Box, LoadingOverlay } from "@mantine/core";

export default function Spinner() {
  return (
    <>
      <Box>
        <LoadingOverlay visible={true} zIndex={998} overlayProps={{ blur: 2 }} />
      </Box>
    </>
  );
}
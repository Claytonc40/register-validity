import { Stack } from "expo-router";
import React from "react";

const ConfiguracoesLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ConfiguracoesLayout;

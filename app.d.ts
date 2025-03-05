/// <reference types="nativewind/types" />

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

// Expo Router types
declare module "expo-router" {
  import type { ComponentType } from "react";

  export type Screen = ComponentType<any>;
  export type Layout = ComponentType<any>;
}

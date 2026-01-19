import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    fileParallelism: false,
    include: ["src/lib/__tests__/**/*.test.ts"],
    setupFiles: ["dotenv/config"],
  },
});

import { defineConfig } from "@kubb/core"
import { pluginClient } from "@kubb/plugin-client"
import { pluginOas } from "@kubb/plugin-oas"
import { pluginTs } from "@kubb/plugin-ts"
import dotenv from "dotenv"

dotenv.config({
  path: [".env", ".env.local", ".env.development", ".env.production"],
})

export default defineConfig({
  root: ".",
  input: {
    path: "api/swagger.json",
  },
  output: {
    path: "src/lib/api",
  },
  hooks: {
    done: ["biome lint --write --unsafe src/lib/api"],
  },
  plugins: [
    pluginOas({ generators: [], validate: false }),
    pluginTs({
      output: {
        path: "types",
      },
    }),
    pluginClient({
      baseURL: "http://localhost:3000", //FIXME: Change to .env
      output: {
        path: "client",
      },
      dataReturnType: "full",
      importPath: "@/lib/client-fetch.ts",
      group: {
        type: "tag",
        name({ group }) {
          return `${group}Controller`
        },
      },
    }),
  ],
})

# Payload SQLite OpenNext Cloudflare drizzle-kit/api repro

Minimal reproduction for `@payloadcms/db-sqlite` making `drizzle-kit/api` reachable from an OpenNext Cloudflare server bundle.

## Reproduction

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Copy the example environment file:

   ```sh
   cp .env.example .env
   ```

3. Build with OpenNext Cloudflare:

   ```sh
   pnpm opennext:build
   ```

4. The build fails while OpenNext bundles the server function:

   ```txt
   ERROR: Could not resolve "drizzle-kit-8c53b399dac79e94/api"
   ```

5. The intermediate Next output also shows `drizzle-kit/api` in the traced server files:

   ```sh
   rg "drizzle-kit/api|drizzle-kit-.*api|generateSQLiteMigration|pushSQLiteSchema" .next .open-next
   ```

## Expected result

`drizzle-kit/api` should not be included in the production runtime/server output unless migrations or schema generation are being run.

## Actual result

`drizzle-kit/api` remains reachable from the SQLite adapter module graph. In this repro, that causes OpenNext Cloudflare server bundling to fail with:

```txt
Could not resolve "drizzle-kit-8c53b399dac79e94/api"
```

The suspected reachable path is:

```txt
@payloadcms/db-sqlite
  -> @payloadcms/drizzle/sqlite
    -> requireDrizzleKit
      -> require('drizzle-kit/api')
```

The relevant Payload import path is:

```ts
// packages/db-sqlite/src/index.ts
import { requireDrizzleKit } from '@payloadcms/drizzle/sqlite'
```

Then the adapter attaches `requireDrizzleKit` to the adapter object. The implementation eventually loads:

```ts
// packages/drizzle/src/sqlite/requireDrizzleKit.ts
const {
  generateSQLiteDrizzleJson,
  generateSQLiteMigration,
  pushSQLiteSchema,
} = require('drizzle-kit/api')
```

## Versions

```txt
payload: 3.84.1
@payloadcms/next: 3.84.1
@payloadcms/db-sqlite: 3.84.1
next: 16.2.4
@opennextjs/cloudflare: 1.19.4
node: >=22
pnpm: 10.33.0
```

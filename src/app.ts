import { config } from "./utils/config";
import { createServer } from "./utils/createServer";
import { logger } from "./utils/logger";

const signals = ["SIGNT", "SIGTERM", "SIGHUP"] as const;

async function gracefulShutdown({
  signal,
  server,
}: {
  signal: typeof signals[number];
  server: Awaited<ReturnType<typeof createServer>>;
}) {
  logger.info(`Got signal ${signal}. Good bye`);
  await server.close();
  process.exit(0);
}

async function startServer() {
  const server = await createServer();

  server.listen({
    port: config.PORT,
    host: config.HOST,
  });

  logger.info(`App is listening`);

  signals.forEach((signal) =>
    process.on(signal, () => {
      gracefulShutdown({ signal, server });
    })
  );
}

startServer();

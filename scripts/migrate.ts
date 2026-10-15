import {
  printHelp,
  runFresh,
  runRollback,
  runSeed,
  runStatus,
  runUp,
} from "../src/lib/db/migrate";

async function main() {
  const [command, arg] = process.argv.slice(2);
  const step = arg ? Number(arg) : undefined;

  switch (command) {
    case "status":
      await runStatus();
      break;
    case "up":
      await runUp(step);
      break;
    case "rollback":
      await runRollback(step);
      break;
    case "fresh":
      await runFresh();
      break;
    case "seed":
      await runSeed();
      break;
    default:
      printHelp();
  }
}

main().catch((err) => {
  console.error("\nMigration failed:", err?.message ?? err);
  process.exit(1);
});

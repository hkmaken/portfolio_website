// Dev launcher that prevents orphaned dev-server processes from piling up.
//
// Why this exists: on Windows especially, stopping `npm run dev` (terminal
// closed, crash, or a stop signal npm doesn't forward) can leave the `next dev`
// process tree orphaned and still watching/recompiling. Repeated restarts stack
// up dozens of these, exhausting RAM and making every new compile thrash.
//
// This launcher owns the next-dev child tree: it records the PID, kills any tree
// left over from a previous run before starting, and tears its own tree down on
// exit. Net effect: at most one dev server per project, ever.
//
// ponytail: PID-file + taskkill is the smallest thing that reliably kills a
// process *tree* on Windows without a dependency. Upgrade path: a cross-platform
// process-tree lib (e.g. tree-kill) if non-Windows teardown ever misbehaves.
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import "./sync-content.mjs"; // runs the content -> public/content sync on import

const isWin = process.platform === "win32";
const PIDFILE = path.join(process.cwd(), ".dev-server.pid");

function killTree(pid) {
  if (!pid) return;
  try {
    if (isWin) {
      spawn("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      process.kill(-pid, "SIGKILL"); // kill the process group
    }
  } catch {
    /* already gone */
  }
}

// 1. Kill any dev server left over from a previous run.
if (existsSync(PIDFILE)) {
  killTree(Number(readFileSync(PIDFILE, "utf8").trim()));
  try {
    rmSync(PIDFILE);
  } catch {
    /* ignore */
  }
}

// 2. Start next dev as our own child, on a fixed port.
const child = spawn("next", ["dev", "-p", "3000"], {
  stdio: "inherit",
  shell: true,
  // own process group on POSIX so we can signal the whole tree
  detached: !isWin,
});
writeFileSync(PIDFILE, String(child.pid));

// 3. Tear the tree down on our own exit / Ctrl+C.
function shutdown() {
  killTree(child.pid);
  try {
    rmSync(PIDFILE);
  } catch {
    /* ignore */
  }
  process.exit();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
child.on("exit", (code) => {
  try {
    rmSync(PIDFILE);
  } catch {
    /* ignore */
  }
  process.exit(code ?? 0);
});

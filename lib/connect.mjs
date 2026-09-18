import { cp, lstat, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const endpoint = 'https://appscreenshots.net/api/mcp';
export const skillName = 'appscreenshots';
const source = fileURLToPath(
  new URL('../skills/appscreenshots/', import.meta.url),
);

export function configFor(client) {
  switch (client) {
    case 'codex':
      return `[mcp_servers.appscreenshots]\nurl = "${endpoint}"\n`;
    case 'claude':
      return (
        JSON.stringify(
          { mcpServers: { appscreenshots: { type: 'http', url: endpoint } } },
          null,
          2,
        ) + '\n'
      );
    case 'zcode':
      // ZCode user-scope file: ~/.zcode/cli/config.json under mcp.servers.
      return (
        JSON.stringify(
          {
            mcp: {
              servers: {
                appscreenshots: { type: 'http', url: endpoint },
              },
            },
          },
          null,
          2,
        ) + '\n'
      );
    case 'gemini':
      return (
        JSON.stringify(
          {
            mcpServers: {
              appscreenshots: { httpUrl: endpoint, oauth: { enabled: true } },
            },
          },
          null,
          2,
        ) + '\n'
      );
    case 'kimi':
      return (
        JSON.stringify(
          { mcpServers: { appscreenshots: { url: endpoint } } },
          null,
          2,
        ) + '\n'
      );
    default:
      throw new Error('Choose codex, claude, zcode, gemini, or kimi.');
  }
}

export function skillTarget(client, destination, home = homedir()) {
  if (!['codex', 'claude', 'zcode', 'custom'].includes(client)) {
    throw new Error(
      'Choose codex, claude, zcode, or custom --dir <skills-directory>.',
    );
  }
  if (destination) return join(resolve(destination), skillName);
  if (client === 'custom')
    throw new Error('custom requires --dir <skills-directory>.');
  return join(
    home,
    client === 'codex' || client === 'zcode' ? '.agents' : '.claude',
    'skills',
    skillName,
  );
}

export async function installSkill(target, dryRun = false) {
  // Refuse existing folders or symlinks; never replace a user's modified skill.
  try {
    await lstat(target);
    throw new Error(
      `Already exists: ${target}. Move it aside before installing an update.`,
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (dryRun) return target;
  await readFile(join(source, 'SKILL.md'), 'utf8');
  await mkdir(dirname(target), { recursive: true });
  await mkdir(target); // Exclusive creation also protects against concurrent installs.
  try {
    for (const entry of await readdir(source)) {
      await cp(join(source, entry), join(target, entry), {
        recursive: true,
        force: false,
        errorOnExist: true,
      });
    }
  } catch (error) {
    await rm(target, { recursive: true, force: true });
    throw error;
  }
  return target;
}

export async function checkService(fetcher = fetch) {
  const metadataUrl =
    'https://appscreenshots.net/.well-known/oauth-protected-resource/api/mcp';
  const response = await fetcher(metadataUrl, {
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404)
    throw new Error(
      'The hosted MCP service is not enabled yet (metadata returned 404). Installing a skill does not enable the server.',
    );
  if (!response.ok)
    throw new Error(`Service metadata returned HTTP ${response.status}.`);
  const data = await response.json();
  if (
    data.resource !== endpoint ||
    !Array.isArray(data.authorization_servers) ||
    !data.authorization_servers.includes('https://appscreenshots.net/api/auth')
  ) {
    throw new Error(
      'Unexpected OAuth resource metadata. Check service deployment before signing in.',
    );
  }
  return 'OAuth resource metadata is available. Complete authorization in your MCP client; this is not an end-to-end compatibility test.';
}

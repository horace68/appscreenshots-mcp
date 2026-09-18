import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  lstat,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  checkService,
  configFor,
  endpoint,
  installSkill,
  skillTarget,
} from '../lib/connect.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = join(root, 'bin/appscreenshots.mjs');
async function temporary(t) {
  const directory = await mkdtemp(join(tmpdir(), 'appscreenshots-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test('client snippets preserve each native HTTP transport format', () => {
  assert.equal(
    JSON.parse(configFor('claude')).mcpServers.appscreenshots.type,
    'http',
  );
  assert.equal(
    JSON.parse(configFor('gemini')).mcpServers.appscreenshots.httpUrl,
    endpoint,
  );
  assert.equal(
    JSON.parse(configFor('kimi')).mcpServers.appscreenshots.url,
    endpoint,
  );
  assert.match(configFor('codex'), /\[mcp_servers\.appscreenshots\]/);
  assert.throws(() => configFor('unknown'), /Choose/);
});

test('checked-in examples match generated configuration', async () => {
  for (const [client, name] of Object.entries({
    codex: 'codex.toml',
    claude: 'claude.mcp.json',
    gemini: 'gemini.settings.json',
    kimi: 'kimi.mcp.json',
  })) {
    assert.equal(
      await readFile(join(root, 'examples', name), 'utf8'),
      configFor(client),
    );
  }
});

test('installs the complete skill into an explicit path, preserving neighboring files', async (t) => {
  const parent = await temporary(t);
  await writeFile(join(parent, 'unrelated.txt'), 'keep');
  const target = skillTarget('custom', parent);
  await installSkill(target);
  assert.equal(
    await readFile(join(target, 'SKILL.md'), 'utf8'),
    await readFile(join(root, 'skills/appscreenshots/SKILL.md'), 'utf8'),
  );
  assert.match(
    await readFile(join(target, 'agents/openai.yaml'), 'utf8'),
    /streamable_http/,
  );
  assert.equal(await readFile(join(parent, 'unrelated.txt'), 'utf8'), 'keep');
});

test('refuses to overwrite an installed and customized skill', async (t) => {
  const target = skillTarget('custom', await temporary(t));
  await installSkill(target);
  await writeFile(join(target, 'SKILL.md'), 'custom user edits');
  await assert.rejects(installSkill(target), /Already exists/);
  assert.equal(
    await readFile(join(target, 'SKILL.md'), 'utf8'),
    'custom user edits',
  );
});

test('refuses symlink destinations', async (t) => {
  const parent = await temporary(t);
  const elsewhere = await temporary(t);
  const target = join(parent, 'appscreenshots');
  await symlink(
    elsewhere,
    target,
    process.platform === 'win32' ? 'junction' : 'dir',
  );
  await assert.rejects(installSkill(target), /Already exists/);
  assert.equal((await lstat(target)).isSymbolicLink(), true);
});

test('dry run creates no files or target directory', async (t) => {
  const target = join(await temporary(t), 'not-created', 'appscreenshots');
  await installSkill(target, true);
  await assert.rejects(lstat(target), { code: 'ENOENT' });
});

test('client paths use their skill directories and custom requires a destination', () => {
  const fakeHome = join(tmpdir(), 'fake-agent-home');
  assert.equal(
    skillTarget('codex', undefined, fakeHome),
    join(fakeHome, '.agents/skills/appscreenshots'),
  );
  assert.equal(
    skillTarget('claude', undefined, fakeHome),
    join(fakeHome, '.claude/skills/appscreenshots'),
  );
  assert.throws(() => skillTarget('custom'), /requires --dir/);
  assert.throws(() => skillTarget('unknown'), /Choose/);
});

test('CLI installation handles paths with spaces and does not launch a shell', async (t) => {
  const directory = join(await temporary(t), 'skills with spaces');
  const output = execFileSync(
    process.execPath,
    [cli, 'install-skill', 'custom', '--dir', directory],
    { encoding: 'utf8' },
  );
  assert.match(output, /Installed:/);
  assert.equal(
    (await lstat(join(directory, 'appscreenshots/SKILL.md'))).isFile(),
    true,
  );
});

test('CLI rejects invalid commands, unused flags and unknown options', () => {
  for (const args of [
    ['bad'],
    ['config', 'codex', '--dir', 'ignored'],
    ['install-skill', 'codex', '--force'],
    ['doctor', 'extra'],
  ]) {
    const result = spawnSync(process.execPath, [cli, ...args], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /AppScreenshots:/);
  }
});

test('doctor distinguishes unavailable and unexpected discovery from valid metadata', async () => {
  await assert.rejects(
    checkService(async () => new Response('', { status: 404 })),
    /not enabled/,
  );
  await assert.rejects(
    checkService(async () =>
      Response.json({ resource: 'wrong', authorization_servers: [] }),
    ),
    /Unexpected/,
  );
  const message = await checkService(async (url, options) => {
    assert.equal(
      url,
      'https://appscreenshots.net/.well-known/oauth-protected-resource/api/mcp',
    );
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers.Authorization, undefined);
    return Response.json({
      resource: endpoint,
      authorization_servers: ['https://appscreenshots.net/api/auth'],
    });
  });
  assert.match(message, /not an end-to-end/);
});

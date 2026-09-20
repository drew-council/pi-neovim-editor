# @bizmyth/pi-neovim-editor

Embedded Neovim as the [Pi coding agent](https://github.com/earendil-works/pi-mono) prompt editor.

## What it does

Pi's prompt area becomes a real `nvim --embed` process. Neovim owns editing, modes, mappings, registers, undo, and rendering. Pi owns submission, application shortcuts, autocomplete, history, and image paste.

## Requirements

- Neovim 0.10 or newer available on `PATH` as `nvim`.
- Your normal Neovim configuration is loaded. The extension never silently falls back to `--clean`. If Neovim fails to start, the error appears in the prompt area; fix your config and run `/reload`.
- Message interception relies on `vim.ui_attach` with `ext_messages`, which Neovim still marks experimental. If it is unavailable, the editor keeps working and reports the notice once.

## Install

```sh
pi install npm:@bizmyth/pi-neovim-editor
```

Restart Pi after installation. Review extensions before installing them; Pi extensions run with your full user permissions.

## Keys: what Pi keeps and what Neovim gets

Any key that resolves to a Pi action (via your effective keybindings—defaults merged with your keybindings file) goes to Pi. Everything else goes to Neovim. This follows the same rule as Pi's built-in editor.

The one exception is **Escape**. Neovim needs Escape to exit insert, visual, operator-pending, or command-line mode:
- In plain normal mode (with no pending operator or count), Escape is a no-op for Neovim, so it routes to Pi (`app.interrupt` under default bindings).
- In any other mode, Escape goes directly to Neovim.

Under default bindings, press Escape twice from insert mode to interrupt the agent.

Under Pi's default keybindings:
- `Enter` submits the prompt (`tui.input.submit`).
- `Shift+Enter` and `Ctrl+J` insert a newline (`tui.input.newLine`).
- `Ctrl+C` clears the prompt (`app.clear`).
- `Ctrl+D` exits Pi (`app.exit`), but only when the prompt is empty. When the prompt has text, `Ctrl+D` reaches Neovim (for half-page scroll in normal mode or dedent in insert mode).

If you prefer Enter to insert newlines and submit with `Ctrl+Enter`, bind `tui.input.submit` to `ctrl+enter` in `~/.pi/agent/keybindings.json`. This frees Enter to fall through to Neovim:

```json
{
  "tui.input.submit": "ctrl+enter"
}
```

If you want `Ctrl+C` to reach Neovim instead of clearing the editor, rebind `app.clear` (for example, to `ctrl+shift+c` or an empty list `[]`):

```json
{
  "app.clear": "ctrl+shift+c"
}
```

Additional commands:
- `:PiSubmit` always submits the prompt from Neovim command-line mode.
- `:q` in Neovim exits Pi rather than restarting the embedded instance.

## Prompt buffer

The prompt lives in a scratch buffer named `[Pi Prompt]` with `filetype=markdown`, initialized in insert mode.

Your Markdown ftplugins, syntax settings, and autocmds apply directly to this buffer. You may open or split other buffers within the embedded Neovim session; Pi autocomplete pauses while another buffer is focused and resumes once `[Pi Prompt]` is active again. Submitting always reads the content of `[Pi Prompt]`.

## Extras

- **Mode badge:** Pi displays the active Neovim mode (`NORMAL`, `INSERT`, `VISUAL`, `COMMAND`, etc.) in the lower editor border, synchronized with Neovim's true state.
- **Notifications:** Neovim messages and errors are forwarded to Pi's notification system because the prompt grid is intentionally compact and cannot display a full message area natively.

## History

Prompt history is per-session and kept in memory, matching Pi's built-in editor.

Pi leaves `tui.editor.historyPrevious` and `tui.editor.historyNext` unbound by default. To browse previous prompts from the editor, bind them in `~/.pi/agent/keybindings.json`:

```json
{
  "tui.editor.historyPrevious": "ctrl+up",
  "tui.editor.historyNext": "ctrl+down"
}
```

Navigating history cycles through previous submissions. Stepping past the newest entry restores the in-progress draft, and editing the buffer resets navigation. Nothing is written to disk.

## Limitations

- **No mouse forwarding:** Mouse events are not forwarded because Pi's component API does not expose the prompt grid's absolute screen coordinates.
- **No external UI / multigrid:** Neovim external popup widgets and multigrid are disabled. The command line renders in the prompt grid's bottom row, while popup menus and floating windows are composed directly into Neovim's line grid.
- **Grid height:** The grid starts at one row, grows with content, and scrolls when reaching Pi's terminal-relative editor maximum.
- **One process per session:** One Neovim child process runs per interactive Pi session and stops when Pi shuts down or reloads.

## Troubleshooting

- **Startup errors:** If Neovim fails to start, test your configuration by running `nvim --embed` directly in your terminal to see startup errors.
- **Reloading:** Run `/reload` in Pi to restart the embedded Neovim process and reload extensions.
- **Crashes:** The extension automatically retries once if Neovim exits unexpectedly, preserving your current prompt text.

## Development

```sh
bun install
bun run check
```

`bun run check` runs Biome, TypeScript 7 (`tsc`, the Go-based compiler), and Bun tests.
`bun test` requires `nvim` (0.10+) on `PATH` to run the integration test suite.

## Releasing

Trusted publishing must already be configured for `publish.yml`. To release a new version:

```sh
bun pm version patch # or: minor / major
git push origin main --follow-tags
gh release create "$(git describe --tags --exact-match)" --generate-notes
```

Publishing the GitHub release runs the checks and publishes the matching package version to npm using OIDC. No long-lived `NPM_TOKEN` is required.

## License

MIT

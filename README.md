# @bizmyth/pi-neovim-editor

Embedded Neovim as the Pi coding agent prompt editor.

## Install

```sh
pi install npm:@bizmyth/pi-neovim-editor
```

Restart Pi after installation. Review extensions before installing them; Pi extensions run with your full user permissions.

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

# errorgap-sourcemaps-action

Uploads every `.map` file under a directory to an Errorgap project for a
release, so browser errors resolve to the original source. It runs
[`npx @errorgap/node sourcemaps`](https://github.com/errorgaphq/errorgap-node#command-line),
and skips without an upload key, so one workflow serves environments that
report and environments that don't.

## Usage

```yaml
- uses: errorgaphq/errorgap-sourcemaps-action@v1
  with:
    directory: dist
    upload-key: ${{ secrets.ERRORGAP_UPLOAD_KEY }}
    endpoint: https://acme.errorgap.com
    project-slug: my-project
```

Each map is filed under the URL of the script it describes:
`dist/assets/app.js.map` becomes `/assets/app.js`, or
`/static/assets/app.js` with `url-prefix: /static`. The release defaults to
the commit being built, which is also what the SDKs report by default.

After [errorgap-setup-action](https://github.com/errorgaphq/errorgap-setup-action),
or in a job whose environment already has `ERRORGAP_ENDPOINT` and
`ERRORGAP_PROJECT_SLUG`, only `directory` and the key are needed:

```yaml
- uses: errorgaphq/errorgap-sourcemaps-action@v1
  continue-on-error: true   # a failed upload shouldn't fail the deploy
  with:
    directory: .output/sourcemaps
    upload-key: ${{ secrets.ERRORGAP_UPLOAD_KEY }}
```

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `directory` | yes | | The directory to search for `.map` files (recursively; `node_modules` is skipped). |
| `release` | no | `github.sha` | The release the maps belong to, as reported by the SDK. |
| `url-prefix` | no | | The path the files are served from. |
| `upload-key` | no | `ERRORGAP_UPLOAD_KEY` | The project's upload key (Errorgap → Project Settings → Upload key). Skips when neither is set. |
| `endpoint` | no | `ERRORGAP_ENDPOINT` | The Errorgap instance. |
| `project-slug` | no | `ERRORGAP_PROJECT_SLUG` | The project's slug. |
| `cli-version` | no | `0.5.0` | The `@errorgap/node` version that does the upload. |

## Outputs

| Output | Description |
|---|---|
| `status` | `uploaded` when every map was accepted, `skipped` when there was no upload key. |

The step fails when Errorgap rejects a map, can't be reached, or no map was
found. Add `continue-on-error: true` where that shouldn't fail the workflow.
The upload key is masked in the job log.

## License

MIT.

yarn add fastify env-schema @fastify/swagger @fastify/type-provider-json-schema-to-ts @sinclair/typebox

yarn add @types/node typescript @commitlint/config-conventional @commitlint/cli @commitlint/{cli,config-conventional} husky prettier vitest tsx -D

npx tsc --init

## Set outDir in tsconfig

## Husky && commitlint

yarn husky install

touch .husky/commit-msg

```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
```

chmod a+x .husky/commit-msg

## Setup prettier

echo {}> .prettierrc.json

touch .prettierignore

touch .husky/pre-commit

chmod a+x .husky/pre-commit

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

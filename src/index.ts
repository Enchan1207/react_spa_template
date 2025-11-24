import { join } from 'node:path'

import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  spinner,
  text,
} from '@clack/prompts'
import * as fs from 'fs-extra'

export const main = async (): Promise<number> => {
  intro('Welcome!')

  log.step('Checking environments...')

  // 現在のディレクトリが空でなければエラーで落とす
  const items = await fs.readdir('.')
  if (items.length > 0) {
    log.error('The current directory is not empty.')
    cancel('Sorry, I must be invoked from empty directory.')
    return 1
  }

  // ディレクトリ名をプロジェクト名とする
  const packageNameCandidate = await fs
    .realpath('.')
    .then((path) => path.split('/').at(-1))

  // パッケージ名として有効?
  const packageNamePattern =
    /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/

  const packageName = await text({
    message: "What's the name of the new package?",
    validate: (value) =>
      packageNamePattern.test(value) ? undefined : 'Invalid name',
    initialValue: packageNameCandidate,
  })

  if (isCancel(packageName)) {
    cancel('Canceled')
    return 1
  }

  // テンプレートを展開
  const extractSpinner = spinner()
  extractSpinner.start('Extracting templates...')
  await fs.copy(join(__dirname, 'template'), '.')
  extractSpinner.stop('Template files were extracted')

  // ファイルをリネーム
  const renameSpinner = spinner()
  renameSpinner.start('Renaming extracted files...')
  const renameFiles: [string, string][] = [
    ['./_gitignore', './.gitignore'],
    ['./packages/frontend/_env', './packages/frontend/.env'],
    ['./packages/backend/_env', './packages/backend/.env'],
    ['./project.code-workspace', `${packageName}.code-workspace`],
  ]
  await Promise.allSettled(
    renameFiles.map(([from, to]) => {
      renameSpinner.message(`${from} -> ${to}`)
      return fs.rename(from, to)
    }),
  )
  renameSpinner.stop('Some files were renamed')

  // package.jsonを更新
  log.step('Modifying package.json...')
  const packageJson = await fs
    .readFile('./package.json')
    .then((data) => JSON.parse(data.toString()) as Record<string, string>)
  packageJson.name = packageName
  await fs.writeJSON('./package.json', packageJson, { spaces: 2 })

  // README.mdを更新
  log.step('Modifying README.md...')
  const readme = await fs
    .readFile('./README.md')
    .then((data) => data.toString())
  const modified = readme.replace(/\[package_name\]/, packageName)
  await fs.writeFile('./README.md', modified)

  outro(`The new package '${packageName}' prepared successfully :)`)

  return 0
}

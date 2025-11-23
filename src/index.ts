import { intro, outro, text, note, log, cancel, isCancel } from '@clack/prompts'
import * as fs from 'fs-extra'
import { join } from 'node:path'

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
  log.step('Extracting templates...')
  await fs.copy(join(__dirname, 'template'), '.')

  // ファイルをリネーム
  log.step('Renaming extracted files...')
  const renameFiles: [string, string][] = [
    ['./_gitignore', './.gitignore'],
    ['./packages/frontend/_env', './packages/frontend/.env'],
    ['./packages/backend/_env', './packages/backend/.env'],
  ]
  await Promise.allSettled(renameFiles.map(([from, to]) => fs.rename(from, to)))

  outro(`The new package '${packageName}' prepared successfully :)`)

  return 0
}

import { main } from 'src'

main()
  .then((code) => process.exit(code))
  .catch((e: unknown) => {
    console.error(e)
    process.exit(1)
  })

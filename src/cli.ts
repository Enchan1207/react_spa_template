import { main } from 'src'

main()
  .then(process.exit)
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

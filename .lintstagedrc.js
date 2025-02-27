/* eslint-disable @typescript-eslint/no-var-requires */
// lint-staged.config.js
const micromatch = require('micromatch')

module.exports = (allStagedFiles) => {
  const returnCmds = []

  // Typescript files in src folder
  const codeFiles = micromatch(allStagedFiles, ['**/src/**/*.ts'])
  if (codeFiles.length) {
    codeFiles.forEach((file) => returnCmds.push(`prettier --write ${file}`))
    returnCmds.push(`git add ${codeFiles.join(' ')}`)
    returnCmds.push(`mocha --require ts-node/register ${codeFiles.join(' ')} --exit`)
  }

  return returnCmds
}

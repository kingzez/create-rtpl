import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'
import * as spinner from './spinner'
import ora from 'ora'
import chalk from 'chalk'

const welcome = (): void => {
  const name = chalk.hex('#FEFEFE').bold('react-template')
  const text = chalk.hex('#F0F0F0')(`  Welcome to ${name} installer`)
  console.log(text)
  console.log('')
}


const logColor = (text: string): string => {
  return chalk.hex('#bdbdbd')(text)
}

const promptText = (text: string): string => {
  text = text.replace('project name', chalk.bold('project name'))
  return logColor(text)
}


class CreateRtpl extends Command {
  static description = 'init react-template project'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(CreateRtpl)
    const name = flags.name // ||
    welcome()
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }

    // input
    const prompt = require('prompt-sync')()
    const required = false
    const str = promptText(`> You need to specify the project name${required ? '(required)' : ''}: `)
    let project = prompt(str).trim()
    const projectPath = path.join(process.cwd(), project)
    if (fs.existsSync(projectPath)) throw new Error(`Abort, "${project}" already exists. Nothing has changed.`)
    const projectName = project

    // clone
    spinner.start('template installing...')
    require('git-clone')(
      'https://github.com/kingzez/react-template',
      projectPath,
      { shallow: true },
      (err: any) => {
        if (err) return console.log(new Error(`About. ${err}`))
        spinner.succeed(true)
        spinner.start('Installed, enjoy!')
        spinner.succeed()
        console.log('')
      },
    )
  }
}

export = CreateRtpl

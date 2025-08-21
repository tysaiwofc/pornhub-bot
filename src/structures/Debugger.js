import c from 'colors'

export default class Debugger {
    constructor() {
        this.date = new Date()
    }
    log(type, log) {
        console.log(c.green('[ ') + c.white(c.bold(type)) + c.green(' ]') + c.blue(' ' + log))
        //console.log('\x1b[0m')
    }

    warn(type, log) {
        console.warn(c.red(`[x] (${type}) - ${log}`))
        console.log('\x1b[0m')
    }
}
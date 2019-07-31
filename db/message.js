const chalk = require('chalk');

function Log() {
    this.success = (m, bundle) => {
        let now = `[${new Date().toISOString().slice(0,19)}]`;
        let prefix = bundle ? bundle.prefix ? bundle.prefix.color(bundle.prefix.text) : '' : '';
        console.log(chalk.blue(now), prefix, chalk.green(m));
        if(bundle) {
            if(bundle.broadcast)
                bundle.sender.in(bundle.room).emit('m', {message: m, type: 'success', time: now})
            else
                bundle.sender.emit('m', {message: m, type: 'success', time: now})
        }
    };
    this.error = (m, bundle) => {
        let now = `[${new Date().toISOString().slice(0,19)}]`;
        let prefix = bundle ? bundle.prefix ? bundle.prefix.color(bundle.prefix.text) : '' : '';
        console.log(chalk.blue(now), prefix, chalk.red(m));
        if(bundle) {
            if(bundle.broadcast)
                bundle.sender.in(bundle.room).emit('m', {message: m, type: 'error', time: now})
            else
                bundle.sender.emit('m', {message: m, type: 'error', time: now})
        }
    };
    this.warn = (m, bundle) => {
        let now = `[${new Date().toISOString().slice(0,19)}]`;
        let prefix = bundle ? bundle.prefix ? bundle.prefix.color(bundle.prefix.text) : '' : '';
        console.log(chalk.blue(now), prefix, chalk.yellow(m));
        if(bundle) {
            if(bundle.broadcast)
                bundle.sender.in(bundle.room).emit('m', {message: m, type: 'warning', time: now})
            else
                bundle.sender.emit('m', {message: m, type: 'warning', time: now})
        }
    };
    this.log = (m, bundle) => {
        let now = `[${new Date().toISOString().slice(0,19)}]`;
        let prefix = bundle ? bundle.prefix ? bundle.prefix.color(bundle.prefix.text) : '' : '';
        console.log(chalk.blue(now), prefix, m);
        if(bundle) {
            if(bundle.broadcast)
                bundle.sender.in(bundle.room).emit('m', {message: m, type: '', time: now})
            else
                bundle.sender.emit('m', {message: m, type: '', time: now})
        }
    };
}

const log = new Log();

module.exports = {
    log
}


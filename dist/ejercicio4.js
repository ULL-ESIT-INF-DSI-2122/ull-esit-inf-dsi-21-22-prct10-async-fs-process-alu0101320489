"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const yargs_1 = __importDefault(require("yargs"));
const child_process_1 = require("child_process");
class wrapper {
    check(r) {
        let ret = undefined;
        const statsObj = (0, fs_1.statSync)(r);
        if (statsObj.isFile()) {
            console.log('Is a file');
            ret = true;
        }
        else if (statsObj.isDirectory()) {
            console.log('Is a directory');
            ret = false;
        }
        return ret;
    }
    createDir(r) {
        if ((0, fs_1.existsSync)(r)) {
            console.log('Existe el directorio');
        }
        else {
            (0, fs_1.mkdir)(r, (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log('Directory created successfully!');
            });
        }
    }
    removeDir(r) {
        if (!(0, fs_1.existsSync)(r)) {
            console.log('No existe el directorio');
        }
        else {
            (0, fs_1.rmdir)(r, (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log('Directory removed successfully!');
            });
        }
    }
    removeFile(r) {
        if (!(0, fs_1.existsSync)(r)) {
            console.log('No existe el fichero');
        }
        else {
            (0, fs_1.rm)(r, (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log('File removed successfully!');
            });
        }
    }
    list(r) {
        const ls = (0, child_process_1.spawn)('ls', ['-R', '-p', r]);
        const grep = (0, child_process_1.spawn)('grep', ['-v', '/']);
        ls.stdout.pipe(grep.stdin);
        grep.stdout.on('data', (info) => {
            console.log(info.toString());
        });
    }
    cat(r) {
        const cat = (0, child_process_1.spawn)('cat', [r]);
        cat.stdout.on('data', (info) => {
            console.log(info.toString());
        });
    }
    copy(r, d) {
        if (!this.check(d)) {
            if (this.check(r)) {
                (0, child_process_1.spawn)('cp', [r, d]);
            }
            else if (!this.check(r)) {
                (0, child_process_1.spawn)('cp', ['-R', r, d]);
            }
        }
        else {
            console.log('Destination route is not a directory');
        }
    }
    move(r, d) {
        if (!this.check(d)) {
            if (this.check(r)) {
                (0, child_process_1.spawn)('move', [r, d]);
            }
        }
        else {
            console.log('Destination route is not a directory');
        }
    }
}
const app = new wrapper();
yargs_1.default.command({
    command: 'check',
    describe: 'Create a dir',
    builder: {
        route: {
            describe: 'Route',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.route === 'string') {
            app.check(argv.route);
        }
    },
});
yargs_1.default.command({
    command: 'mkdir',
    describe: 'Create a dir',
    builder: {
        route: {
            describe: 'Route',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.route === 'string') {
            app.createDir(argv.route);
        }
    },
});
yargs_1.default.command({
    command: 'rm',
    describe: 'Remove dir or file',
    builder: {
        route: {
            describe: 'Route',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.route === 'string') {
            if (app.check(argv.route)) {
                app.removeFile(argv.route);
            }
            else {
                app.removeDir(argv.route);
            }
        }
    },
});
yargs_1.default.command({
    command: 'list',
    describe: 'Remove dir or file',
    builder: {
        route: {
            describe: 'Route',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.route === 'string') {
            if (!app.check(argv.route)) {
                app.list(argv.route);
            }
            else {
                console.log('No es un directorio');
            }
        }
    },
});
yargs_1.default.command({
    command: 'cat',
    describe: 'Remove dir or file',
    builder: {
        route: {
            describe: 'Route',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        if (typeof argv.route === 'string') {
            if (app.check(argv.route)) {
                app.cat(argv.route);
            }
            else {
                console.log('Not a file');
            }
        }
    },
});
yargs_1.default.command({
    command: 'move',
    describe: 'Remove dir or file',
    builder: {
        route: {
            describe: 'Route',
            demandOption: true,
            type: 'string',
        },
        destination: {
            describe: 'Route',
            demandOption: true,
            type: 'string',
        }
    },
    handler(argv) {
        if ((typeof argv.route === 'string') && (typeof argv.destination === 'string')) {
            app.move(argv.route, argv.destination);
        }
    },
});
yargs_1.default.command({
    command: 'copy',
    describe: 'Remove dir or file',
    builder: {
        route: {
            describe: 'Destination Route',
            demandOption: true,
            type: 'string',
        },
        destination: {
            describe: 'Destination Route',
            demandOption: true,
            type: 'string',
        }
    },
    handler(argv) {
        if ((typeof argv.route === 'string') && (typeof argv.destination === 'string')) {
            app.copy(argv.route, argv.destination);
        }
    },
});
yargs_1.default.parse();

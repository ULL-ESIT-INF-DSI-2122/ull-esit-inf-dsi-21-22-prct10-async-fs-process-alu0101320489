"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printColor = exports.createDir = exports.read = exports.list = exports.mod = exports.del = exports.add = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const yargs_1 = __importDefault(require("yargs"));
let n;
let file;
/**
 * Funcion que añade una nota
 * @param usuario usuario
 * @param titulo titulo
 * @param data datos
 * @param color color
 */
function add(usuario, titulo, data, color) {
    if (typeof usuario === 'string') {
        createDir(usuario);
    }
    (0, fs_1.readFile)('notas/' + usuario + '/notas.txt', (_, d) => {
        if ((typeof titulo === 'string') && (typeof data === 'string') && (typeof usuario === 'string') && (typeof color === 'string')) {
            let is_in;
            is_in = false;
            if (!file) {
                n = JSON.parse(d.toString());
                n.notas.forEach((element) => { if (element.titulo == titulo) {
                    is_in = true;
                } });
                if (is_in) {
                    console.log(chalk_1.default.red('Nota existente'));
                }
                else {
                    n.notas.push({ usuario: usuario, titulo: titulo, data: data, color: color });
                    console.log(chalk_1.default.green('Nueva nota añadida'));
                    try {
                        (0, fs_1.writeFileSync)('notas/' + usuario + '/notas.txt', JSON.stringify(n));
                        console.log(chalk_1.default.green('La información ha sido añadida correctamente'));
                    }
                    catch (err) {
                        console.log(chalk_1.default.red('Se ha producido un error'));
                    }
                }
            }
            else {
                n = { notas: [{ usuario: '', titulo: '', data: '', color: '' }] };
                n.notas[0].usuario = usuario;
                n.notas[0].titulo = titulo;
                n.notas[0].data = data;
                n.notas[0].color = color;
                console.log(chalk_1.default.green('Nueva nota añadida'));
                try {
                    (0, fs_1.writeFileSync)('notas/' + usuario + '/notas.txt', JSON.stringify(n));
                    console.log(chalk_1.default.green('La información ha sido añadida correctamente'));
                }
                catch (err) {
                    console.log(chalk_1.default.red('Se ha producido un error'));
                }
            }
        }
    });
}
exports.add = add;
/**
 * Funcion que elimina una nota
 * @param usuario ususario
 * @param titulo titulo
 */
function del(usuario, titulo) {
    if (typeof usuario === 'string') {
        createDir(usuario);
    }
    if (file) {
        console.log(chalk_1.default.red('Se trata de un archivo nuevo'));
    }
    else {
        (0, fs_1.readFile)('notas/' + usuario + '/notas.txt', (_, d) => {
            if ((typeof titulo === 'string') && (typeof usuario === 'string')) {
                let is_in;
                is_in = false;
                n = JSON.parse(d.toString());
                n.notas.forEach((element, i) => { if (element.titulo == titulo) {
                    is_in = true, n.notas.splice(i, 1);
                    console.log(chalk_1.default.green('Borrada correctamente'));
                } });
                if (!is_in) {
                    console.log(chalk_1.default.red('La nota no existe'));
                }
                try {
                    (0, fs_1.writeFileSync)('notas/' + usuario + '/notas.txt', JSON.stringify(n));
                }
                catch (err) {
                    console.log(chalk_1.default.red('Se ha producido un error'));
                }
            }
        });
    }
}
exports.del = del;
/**
 * Fucnion que modifica una nota
 * @param usuario usuario
 * @param titulo titulo
 * @param data datos
 * @param color color
 */
function mod(usuario, titulo, data, color) {
    if (typeof usuario === 'string') {
        createDir(usuario);
    }
    if (file) {
        console.log(chalk_1.default.red('Se trata de un archivo nuevo'));
    }
    else {
        (0, fs_1.readFile)('notas/' + usuario + '/notas.txt', (_, d) => {
            if ((typeof titulo === 'string') && (typeof data === 'string') && (typeof usuario === 'string') && (typeof color === 'string')) {
                let is_in;
                is_in = false;
                n = JSON.parse(d.toString());
                n.notas.forEach((element) => {
                    if (element.titulo == titulo) {
                        is_in = true;
                        if ((typeof color === 'string') && (typeof data === 'string')) {
                            element.data = data;
                            element.color = color;
                            console.log(chalk_1.default.green('Modificado correctamente'));
                        }
                    }
                });
                if (!is_in) {
                    console.log(chalk_1.default.red('Nota no existente'));
                }
                try {
                    (0, fs_1.writeFileSync)('notas/' + usuario + '/notas.txt', JSON.stringify(n));
                    console.log(chalk_1.default.green('La información ha sido añadida correctamente'));
                }
                catch (err) {
                    console.log(chalk_1.default.red('Se ha producido un error'));
                }
            }
        });
    }
}
exports.mod = mod;
/**
 * Funcion que lista las notas de un usuario
 * @param usuario usuario
 */
function list(usuario) {
    if (typeof usuario === 'string') {
        createDir(usuario);
    }
    if (file) {
        console.log(chalk_1.default.red('Se trata de un archivo nuevo'));
    }
    else {
        (0, fs_1.readFile)('notas/' + usuario + '/notas.txt', (_, data) => {
            if ((typeof usuario === 'string')) {
                n = JSON.parse(data.toString());
                n.notas.forEach((element) => printColor(element.color, element.titulo));
            }
        });
    }
}
exports.list = list;
/**
 * Funcion que muestra el contenido de una nota
 * @param usuario usuario
 * @param titulo titulo
 */
function read(usuario, titulo) {
    if (typeof usuario === 'string') {
        createDir(usuario);
    }
    if (file) {
        console.log(chalk_1.default.red('Se trata de un archivo nuevo'));
    }
    else {
        (0, fs_1.readFile)('notas/' + usuario + '/notas.txt', (_, data) => {
            if ((typeof titulo === 'string') && (typeof usuario === 'string')) {
                let is_in;
                is_in = false;
                n = JSON.parse(data.toString());
                n.notas.forEach((element) => { if (element.titulo == titulo) {
                    is_in = true;
                    printColor(element.color, element.titulo + ': ' + element.data);
                } });
                if (!is_in) {
                    console.log(chalk_1.default.red('Nota no existente'));
                }
            }
        });
    }
}
exports.read = read;
/**
 * Funcion que crea un directorio
 * @param u nombre del usuario
 */
function createDir(u) {
    if ((0, fs_1.existsSync)('notas/' + u)) {
        console.log(chalk_1.default.green('Existe el directorio'));
        file = false;
    }
    else {
        (0, fs_1.mkdirSync)('notas/' + u);
        (0, fs_1.openSync)('notas/' + u + '/notas.txt', 'w');
        file = true;
    }
}
exports.createDir = createDir;
/**
 * Funcion que muestra un texto en un color
 * @param c color
 * @param data texto
 */
function printColor(c, data) {
    switch (c) {
        case ('rojo'):
            console.log(chalk_1.default.red(data));
            break;
        case ('azul'):
            console.log(chalk_1.default.blue(data));
            break;
        case ('verde'):
            console.log(chalk_1.default.green(data));
            break;
        case ('amarillo'):
            console.log(chalk_1.default.yellow(data));
            break;
        default:
            console.log(chalk_1.default.gray(data));
            break;
    }
}
exports.printColor = printColor;
yargs_1.default.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        usuario: {
            describe: 'Note user',
            demandOption: true,
            type: 'string',
        },
        titulo: {
            describe: 'Note title',
            demandOption: true,
            type: 'string',
        },
        data: {
            describe: 'Note data',
            demandOption: true,
            type: 'string',
        },
        color: {
            describe: 'Note color',
            demandOption: true,
            type: 'string',
        }
    },
    handler(argv) {
        if ((typeof argv.titulo === 'string') && (typeof argv.data === 'string') && (typeof argv.usuario === 'string') && (typeof argv.color === 'string')) {
            add(argv.usuario, argv.titulo, argv.data, argv.color);
        }
    },
});
yargs_1.default.command({
    command: 'delete',
    describe: 'Delete note',
    builder: {
        usuario: {
            describe: 'Note user',
            demandOption: true,
            type: 'string',
        },
        titulo: {
            describe: 'Note title',
            demandOption: true,
            type: 'string',
        }
    },
    handler(argv) {
        if ((typeof argv.titulo === 'string') && (typeof argv.usuario === 'string')) {
            del(argv.usuario, argv.titulo);
        }
    },
});
yargs_1.default.command({
    command: 'mod',
    describe: 'Modify a new note',
    builder: {
        usuario: {
            describe: 'Note user',
            demandOption: true,
            type: 'string',
        },
        titulo: {
            describe: 'Note title',
            demandOption: true,
            type: 'string',
        },
        data: {
            describe: 'Note data',
            demandOption: true,
            type: 'string',
        },
        color: {
            describe: 'Note color',
            demandOption: true,
            type: 'string',
        }
    },
    handler(argv) {
        if ((typeof argv.titulo === 'string') && (typeof argv.data === 'string') && (typeof argv.usuario === 'string') && (typeof argv.color === 'string')) {
            mod(argv.usuario, argv.titulo, argv.data, argv.color);
        }
    },
});
yargs_1.default.command({
    command: 'list',
    describe: 'List note',
    builder: {
        usuario: {
            describe: 'Note user',
            demandOption: true,
            type: 'string',
        }
    },
    handler(argv) {
        if ((typeof argv.usuario === 'string')) {
            list(argv.usuario);
        }
    },
});
yargs_1.default.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        usuario: {
            describe: 'Note user',
            demandOption: true,
            type: 'string',
        },
        titulo: {
            describe: 'Note title',
            demandOption: true,
            type: 'string',
        }
    },
    handler(argv) {
        if ((typeof argv.titulo === 'string') && (typeof argv.usuario === 'string')) {
            read(argv.usuario, argv.titulo);
        }
    },
});
yargs_1.default.parse();

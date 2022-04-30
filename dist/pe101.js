"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const child_process_1 = require("child_process");
/**
 * Clase que realiza watch sobre un fichero a su vez que ejecuta comandos
 */
class pe101watch {
    /**
     *
     * @param fname argumento del nombre de fichero;
     * @param com argumentos de los comandos
     */
    constructor(fname, com) {
        this.fname = fname;
        this.com = com;
        this.ls_out = [];
    }
    /**
     * Método que ejecuta el programa
     */
    run() {
        if (this.f_exist()) {
            (0, fs_1.watch)(this.fname, (eventType, filename) => {
                console.log("\nThe file", filename, "was modified!");
                console.log("The type of change was:", eventType);
                if (eventType == 'rename') {
                    console.log('Archivo eliminado renombrado');
                    process.exit(0);
                }
                this.f_command();
            });
        }
    }
    /**
     * Comprueba si existe el fichero
     * @returns retorna true si existe y false si no
     */
    f_exist() {
        if ((0, fs_1.existsSync)(this.fname)) {
            return true;
        }
        else {
            console.log("No existe el fichero");
            return false;
        }
    }
    /**
     * Método que gestiona los comandos asignados
     */
    f_command() {
        const c = this.com.join(' ');
        console.log(c);
        (0, child_process_1.exec)(c + ' ' + this.fname, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            this.ls_out.push(stdout);
        });
    }
}
const a = new pe101watch(process.argv[2], process.argv.splice(3));
a.run();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class notewatch {
    /**
     *
     * @param uname argumento del nombre de fichero;
     * @param com argumentos de los comandos
     */
    constructor(uname, route) {
        this.uname = uname;
        this.route = route;
    }
    /**
     * Método que ejecuta el programa
     */
    run() {
        if (this.f_exist()) {
            (0, fs_1.watch)(this.route + this.uname, (eventType, filename) => {
                console.log("\nArchivo", filename, "modificado!");
                console.log("Tipo de cambio:", eventType);
                if (eventType == 'change') {
                    console.log('Archivo modificado'); /*process.exit(0)*/
                }
                if (eventType == 'rename') {
                    console.log('Archivo eliminado, renombrado o creado'); /*process.exit(0)*/
                }
            });
        }
    }
    /**
     * Comprueba si existe el fichero
     * @returns retorna true si existe y false si no
     */
    f_exist() {
        if ((0, fs_1.existsSync)(this.route + this.uname)) {
            return true;
        }
        else {
            console.log("No existe el directorio");
            return false;
        }
    }
}
if (process.argv.length !== 4) {
    console.log('Introduce un usuario y una ruta');
}
else {
    const a = new notewatch(process.argv[2], process.argv[3]);
    a.run();
}

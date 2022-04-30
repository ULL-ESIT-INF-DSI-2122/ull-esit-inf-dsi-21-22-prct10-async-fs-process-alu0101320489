import {watch,existsSync} from 'fs';

class notewatch {
    /**
     * 
     * @param uname argumento del nombre de fichero;
     * @param route argumentos de la ruta
     */
    constructor(private uname:string , private route:string){}
    /**
     * Método que ejecuta el programa
     */
    run():void {
        if (this.f_exist()) {
            watch(this.route+this.uname, (eventType, filename) => {
                console.log("\nArchivo", filename, "modificado!");
                console.log("Tipo de cambio:", eventType);
                if (eventType == 'change') {console.log('Archivo modificado');}
                if (eventType == 'rename') {console.log('Archivo eliminado, renombrado o creado');}
            });
        }
    }
    /**
     * Comprueba si existe el fichero
     * @returns retorna true si existe y false si no
     */
    f_exist():boolean {
        if (existsSync(this.route+this.uname)) {
            return true;
        } else {
            console.log("No existe el directorio");
            return false;
        }
    }
}
if (process.argv.length !== 4) {
    console.log('Introduce un usuario y una ruta');
} else {
    const a = new notewatch(process.argv[2], process.argv[3]);
    a.run();
}
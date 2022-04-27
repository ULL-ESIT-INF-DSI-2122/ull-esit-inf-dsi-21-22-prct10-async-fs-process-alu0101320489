import {watch,existsSync} from 'fs';
import {exec} from 'child_process';

/**
 * Clase que realiza watch sobre un fichero a su vez que ejecuta comandos
 */
class pe101watch {
    private ls_out: string[];
    /**
     * 
     * @param fname argumento del nombre de fichero;
     * @param com argumentos de los comandos
     */
    constructor(private fname:string , private com:string[]){
        this.ls_out = [];
    }
    /**
     * Método que ejecuta el programa
     */
    run():void {
        if (this.f_exist()) {
            watch(this.fname, (eventType, filename) => {
                console.log("\nThe file", filename, "was modified!");
                console.log("The type of change was:", eventType);
                if (eventType == 'rename') {console.log('Archivo eliminado renombrado'); process.exit(0)}
                this.f_command();
            });
        }
    }
    /**
     * Comprueba si existe el fichero
     * @returns retorna true si existe y false si no
     */
    f_exist():boolean {
        if (existsSync(this.fname)) {
            return true;
        } else {
            console.log("No existe el fichero");
            return false;
        }
    }
    /**
     * Método que gestiona los comandos asignados
     */
    f_command(): void {
        const c: string = this.com.join(' ');
        console.log(c);
        exec(c + ' ' + this.fname, (error, stdout, stderr) => {
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
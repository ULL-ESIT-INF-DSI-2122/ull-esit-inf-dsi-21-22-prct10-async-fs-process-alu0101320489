import {existsSync} from 'fs';
import {spawn} from 'child_process';

/**
 * Clase para representar un programa que devuelva el número de ocurrencias de una palabra en un fichero de texto
 */
class cat_greep {
    /**
     * 
     * @param fname nombre del fichero
     * @param word palabra a buscar
     */
    constructor(private fname: string, private word: string) {}
    /**
     * Método que ejecutará la funcionalidad de la clase, el cat y el grep
     */
    run():void {
        if (this.f_exist()) {
            const cat = spawn('cat', [this.fname]);
            const grep = spawn('grep', [this.word]);
            cat.stdout.pipe(grep.stdin);
            
            grep.stdout.on('data', (info) => {
                const data:string = info.toString('utf8');
                const aux:string[] = data.split(/[' '\n]/ig);
                let output = 0;
                aux.forEach(element => {if(element == this.word){output++}});
                if (output != 0) {
                    console.log(output);
                } else {
                    console.log('No matchs')
                }
            });
        }
    }
    /**
     * Método que comprueba si existe el fichero
     * @returns true si existe y false si no
     */
    f_exist():boolean {
        if (existsSync(this.fname)) {
            return true;
        } else {
            console.log("File doesn't exist");
            return false;
        }
    }
}

if (process.argv.length !== 4) {
    console.log('Please, specify a file and word');
} else {
    const cg = new cat_greep(process.argv[2], process.argv[3]);
    cg.run();
}
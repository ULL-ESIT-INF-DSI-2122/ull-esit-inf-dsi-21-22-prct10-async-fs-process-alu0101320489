import { existsSync, mkdir, statSync, rmdir,rm} from 'fs';
import yargs from 'yargs';
import {spawn} from 'child_process';

/**
 * Clase para representar unna aplicaión wrapper de comandos
 */
class wrapper {
  /**
   * Comprueba si es fichero o directorio
   * @param r ruta
   * @returns true si es fichero false si es directorio
   */
  check(r: string): boolean|undefined {
    let ret = undefined;
    const statsObj = statSync(r);
    if(statsObj.isFile()){
        console.log('Is a file');
        ret = true;
    } else if(statsObj.isDirectory()){
        console.log('Is a directory');
        ret = false;
    }
    return ret;
  }
  /**
   * Crea un directorio
   * @param r ruta
   */
  createDir(r: string): void {
    if (existsSync(r)) {
      console.log('Already exists');
    } else {
        mkdir(r, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
        });
    }
  }
  /**
   * Elimina un directorio
   * @param r ruta
   */
  removeDir(r: string): void {
    if (!existsSync(r)) {
      console.log('No existing directory');
    } else {
        rmdir(r, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory removed successfully!');
        });
    }
  }
  /**
   * Elimina un fichero
   * @param r ruta
   */
  removeFile(r: string): void {
    if (!existsSync(r)) {
      console.log('No existing file');
    } else {
        rm(r, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('File removed successfully!');
        });
    }
 }
 /**
  * Lista todos los ficheros de un directorio
  * @param r tuta
  */
  list(r: string): void {
    const ls = spawn('ls', ['-R','-p',r]);
    const grep = spawn('grep', ['-v', '/']);
    ls.stdout.pipe(grep.stdin);
    grep.stdout.on('data', (info) => {
      console.log(info.toString());
    });
  }
  /**
   * Muestra el contenido de un fichero
   * @param r ruta
   */
  cat(r: string): void {
    const cat = spawn('cat', [r]);
    cat.stdout.on('data', (info) => {
      console.log(info.toString());
    });
  }
  /**
   * Copia un fichero o un directorio con todo cu contenido
   * @param r origen
   * @param d destino
   */
  copy(r: string, d: string): void {
    if (!this.check(d)) {
      if(this.check(r)) {
        spawn('cp', [r,d]);
      } else if (!this.check(r)) {
        spawn('cp', ['-R',r,d]);
      }
    } else {
      console.log('Destination route is not a directory')
    }
  }
  /**
   * Mueve un fichero
   * @param r origen
   * @param d destino
   */
  move(r: string, d: string): void {
    if (!this.check(d)) {
      if(this.check(r)) {
        spawn('mv', [r,d]);
      }
    } else {
      console.log('Destination route is not a directory')
    }
  }
}

const app = new wrapper();

yargs.command({
    command: 'check',
    describe: 'Check if is a dir o file',
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

yargs.command({
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

yargs.command({
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
        if (app.check(argv.route)) {app.removeFile(argv.route)}
        else {app.removeDir(argv.route)}
      }
    },
  });

yargs.command({
    command: 'list',
    describe: 'List files of a directory',
    builder: {
      route: {
        describe: 'Route',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.route === 'string') {
        if (!app.check(argv.route)) {app.list(argv.route)}
        else {console.log('Not a directory')}
      }
    },
  });

yargs.command({
    command: 'cat',
    describe: 'Show data of a file',
    builder: {
      route: {
        describe: 'Route',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.route === 'string') {
        if(app.check(argv.route)) {app.cat(argv.route)}
        else {console.log('Not a file')}
      }
    },
  });
  
yargs.command({
    command: 'move',
    describe: 'Move a file',
    builder: {
      route: {
        describe: 'File',
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
      if ((typeof argv.route === 'string')&&(typeof argv.destination === 'string')) {
        app.move(argv.route,argv.destination);
      }
    },
  });

yargs.command({
    command: 'copy',
    describe: 'Copy file o directory',
    builder: {
      route: {
        describe: 'File o directory',
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
      if ((typeof argv.route === 'string')&&(typeof argv.destination === 'string')) {
        app.copy(argv.route,argv.destination);
      }
    },
  });
yargs.parse();
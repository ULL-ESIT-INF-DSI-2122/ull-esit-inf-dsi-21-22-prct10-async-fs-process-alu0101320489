import chalk from 'chalk';
import { writeFileSync, existsSync, mkdirSync,readFile, openSync} from 'fs';
import yargs from 'yargs';

/**
 * Tipo de datos para representar las notas
 */
type notes = {
    notas: {usuario:string, titulo:string, data:string, color:string}[]
};
let n:notes;
let file: boolean;
/**
 * Funcion que añade una nota
 * @param usuario usuario
 * @param titulo titulo
 * @param data datos
 * @param color color
 */
export function add(usuario: string, titulo: string, data:string, color:string):void {
  if (typeof usuario === 'string') {createDir(usuario);}
        readFile('notas/'+usuario+'/notas.txt', (_, d) => {
        if ((typeof titulo === 'string')&&(typeof data === 'string')&&(typeof usuario === 'string')&&(typeof color === 'string')) {
          let is_in:boolean;
          is_in = false;
          if (!file) {
            n = JSON.parse(d.toString());
            n.notas.forEach((element) => {if (element.titulo== titulo) {is_in = true}});
            if(is_in) {
              console.log(chalk.red('Nota existente'));
            }else {
              n.notas.push({usuario: usuario, titulo: titulo, data:data, color:color});
              console.log(chalk.green('Nueva nota añadida'));
          
            try {
              writeFileSync('notas/'+usuario+'/notas.txt', JSON.stringify(n));
              console.log(chalk.green('La información ha sido añadida correctamente'));
            } catch (err) {
              console.log(chalk.red('Se ha producido un error'));
            }
            }  
          }else {
            n = {notas: [{usuario:'', titulo:'', data:'', color:''}]};
            n.notas[0].usuario = usuario;
            n.notas[0].titulo = titulo;
            n.notas[0].data = data;
            n.notas[0].color = color;
            console.log(chalk.green('Nueva nota añadida'));
        
            try {
              writeFileSync('notas/'+usuario+'/notas.txt', JSON.stringify(n));
              console.log(chalk.green('La información ha sido añadida correctamente'));
            } catch (err) {
              console.log(chalk.red('Se ha producido un error'));
            }
          }
        }
    })
}
/**
 * Funcion que elimina una nota
 * @param usuario ususario
 * @param titulo titulo
 */
export function del(usuario: string, titulo: string):void {
  if (typeof usuario === 'string') {createDir(usuario);}
  if (file) {
    console.log(chalk.red('Se trata de un archivo nuevo'));
  } else {
    readFile('notas/'+usuario+'/notas.txt', (_, d) => {
    if ((typeof titulo === 'string')&&(typeof usuario === 'string')) {
      let is_in:boolean;
      is_in = false;
      n = JSON.parse(d.toString());
      n.notas.forEach((element,i) => {if (element.titulo== titulo) {is_in = true, n.notas.splice(i,1); console.log(chalk.green('Borrada correctamente'))}});
      if (!is_in) {
        console.log(chalk.red('La nota no existe'))
      }
      try {
        writeFileSync('notas/'+usuario+'/notas.txt', JSON.stringify(n));
      } catch (err) {
        console.log(chalk.red('Se ha producido un error'));
      }
    }
  })
  }
}
/**
 * Fucnion que modifica una nota
 * @param usuario usuario
 * @param titulo titulo
 * @param data datos
 * @param color color
 */
export function mod(usuario: string, titulo: string, data:string, color:string) {
  if (typeof usuario === 'string') {createDir(usuario);}
  if (file) {
    console.log(chalk.red('Se trata de un archivo nuevo'));
  } else {
    readFile('notas/'+usuario+'/notas.txt', (_, d) => {
    if ((typeof titulo === 'string')&&(typeof data === 'string')&&(typeof usuario === 'string')&&(typeof color === 'string')) {
      let is_in:boolean;
      is_in = false;
      n = JSON.parse(d.toString());
      n.notas.forEach((element) => {if (element.titulo == titulo) {
        is_in = true; 
        if ((typeof color === 'string')&&(typeof data === 'string')) {
          element.data = data;
          element.color = color;
          console.log(chalk.green('Modificado correctamente'));
        }}});
      if(!is_in) {
        console.log(chalk.red('Nota no existente'));
      }
      try {
        writeFileSync('notas/'+usuario+'/notas.txt', JSON.stringify(n));
        console.log(chalk.green('La información ha sido añadida correctamente'));
      } catch (err) {
        console.log(chalk.red('Se ha producido un error'));
      }
    }
  })
}
}
/**
 * Funcion que lista las notas de un usuario
 * @param usuario usuario
 */
export function list(usuario:string):void {
  if (typeof usuario === 'string') {createDir(usuario);}
  if (file) {
    console.log(chalk.red('Se trata de un archivo nuevo'));
  } else {
    readFile('notas/'+usuario+'/notas.txt', (_, data) => {
    if ((typeof usuario === 'string')) {
      n = JSON.parse(data.toString());
      n.notas.forEach((element) => printColor(element.color, element.titulo));
    }
  })
  }
}
/**
 * Funcion que muestra el contenido de una nota 
 * @param usuario usuario
 * @param titulo titulo
 */
export function read(usuario:string, titulo:string):void {
  if (typeof usuario === 'string') {createDir(usuario);}
  if (file) {
    console.log(chalk.red('Se trata de un archivo nuevo'));
  } else {
    readFile('notas/'+usuario+'/notas.txt', (_, data) => {
    if ((typeof titulo === 'string')&&(typeof usuario === 'string')) {
      let is_in:boolean;
      is_in = false;
      n = JSON.parse(data.toString());
      n.notas.forEach((element) => {if (element.titulo== titulo) {is_in = true; printColor(element.color, element.titulo+': '+element.data);}});
      if(!is_in) {
        console.log(chalk.red('Nota no existente'));
      } 
    }
  })
  }
}
/**
 * Funcion que crea un directorio
 * @param u nombre del usuario
 */
export function createDir(u: string): void {
  if (existsSync('notas/'+u)) {
    console.log(chalk.green('Existe el directorio'));
    file = false;
  } else {
    mkdirSync('notas/'+u);
    openSync('notas/'+u+'/notas.txt', 'w');
    file = true;
  }
}
/**
 * Funcion que muestra un texto en un color
 * @param c color
 * @param data texto
 */
export function printColor(c: string, data:string):void {
  switch(c) {
    case('rojo'):
      console.log(chalk.red(data));
      break;
    case('azul'):
      console.log(chalk.blue(data));
      break;
    case('verde'):
      console.log(chalk.green(data));
      break;
    case('amarillo'):
      console.log(chalk.yellow(data));
      break;
    default:
      console.log(chalk.gray(data));
      break;
  }
}

yargs.command({
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
      if ((typeof argv.titulo === 'string')&&(typeof argv.data === 'string')&&(typeof argv.usuario === 'string')&&(typeof argv.color === 'string')) {
        add(argv.usuario, argv.titulo, argv.data, argv.color);
      }
    },
  });

  yargs.command({
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
      if ((typeof argv.titulo === 'string')&&(typeof argv.usuario === 'string')) {
        del(argv.usuario, argv.titulo);
      }
    },
  });

  yargs.command({
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
      if ((typeof argv.titulo === 'string')&&(typeof argv.data === 'string')&&(typeof argv.usuario === 'string')&&(typeof argv.color === 'string')) {
        mod(argv.usuario, argv.titulo, argv.data, argv.color);
      }
      
    },
  });
  yargs.command({
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

  yargs.command({
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
      if ((typeof argv.titulo === 'string')&&(typeof argv.usuario === 'string')) {
        read(argv.usuario, argv.titulo);
      }
    },
  });
yargs.parse();
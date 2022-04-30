## Ejercicio 1

Este código trata de observar un los cambios de un fichero cuando se ejecuta. De esta manera con el uso de `watch` obtiene si el fichero como argumento de linea de comandos ha sido modificado.

Primero comprueba si por línea de comando se le ha pasado un único argumento el cual será el nombre del fichero. Si no cumple la condición, no ejecuta el programa y avisa con un mensaje:

```ts
if (process.argv.length !== 3) {
  console.log('Please, specify a file');
}
```

Si no hay error se ejecuta el código principal que con el uso de `access` accede al fichero que se le pasa como primer parámetro. El segundo parámetro es `constants.F_OK` el cual en este caso, denota los permisos de acceso al fichero. Lo anterior lo hacemos para comprobar si el fichero que se ha pasado existe o no. Por último, si existe el fichero, se prodece a ejecutar el `watch` sobre el mismo. Cada vez que el callback devuelva un cambio muestra un mensaje por pantalla.

```ts
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
```

Si queremos realizar una traza de ejecución con cada paso podemos prabar a insertar `console.log(console.trace());` dentro del código para observar la pila de llamadas. 

```ts
    const watcher = watch(process.argv[2]);
    console.log(console.trace());

    watcher.on('change', () => {
        console.log(console.trace());
        console.log(`File ${filename} has been modified somehow`);
    });
    console.log(console.trace());
    console.log(`File ${filename} is no longer watched`);
```

Como podemos observar en la imagen que muestra la salida por consola, concluimos que al llegar al llegar al `watch`, la pila de llamadas se mantiene vacía y el manejador es introducido dentro de registro de eventos del API hasta que se produzca la modificación del fichero. Como desde un principio no se modifica el fichero el programa deja al `watch`  a la espera del manejador y continua ejecutando el resto del código. Por esto es que vemos que muestra eñ mensaje de que el fichero no está siendo observado más. A la hora de modificar el fichero, el manejado pasa a la cola y como no hay ninguna llamada en la pila de llamadas se traspasa a esta y se ejecuta. Tras esto el `watch` queda constantemente ejecutando para cualquier cambio.

## Ejercicio 2

Para resolver este ejercico se ha creado una clse `cat_grep`, la cual tiene como parámetros el nombre del fichero y la palabra con la que se quieren mostrar las ocurrencias. Esta clase tiene dos método uno `f_exist` que comprueba si el fichero pasado como parámetro existe, devolviendo true o false. El otro método es `run` el cual se encargará de ejecutar el método anterior junto con código restante para el funcionamiento del programa.

```ts
class cat_greep {
    constructor(private fname: string, private word: string) {}
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
    f_exist():boolean {
        if (existsSync(this.fname)) {
            return true;
        } else {
            console.log("File doesn't exist");
            return false;
        }
    }
}
```

El método `run` comprueba primero de la existencia del fichero para posteriormente haciendo uso de `spawn`, ejecutar el comando *cat* sobre el fichero. Tras esto realizamos lo mismo con el comando *grep* sin embargo, se ejecutará sobre la salida del comado *cat* anterior ya que se lo pasamos al `stdin` a partir de una `pipe`. Posteriormente usando `on` sobre la salida de *grep*, obtenemos el buffer del comando y lo guardamos como un string, separando cada palabra en un índice de un array con `split`. Por último revisamos cada palabra almacenada en el array comprobando si es igual a la palabra que se quiere buscar y contando las veces que aparece para posteriormente mostrarlo por pantalla. En el caso de que no haya ninguna ocurrencia se muestra un mensaje.

A la hora de ejecutar el método anterior se comprueba si el número de argumentos pasados por consola es correcto.

```ts
if (process.argv.length !== 4) {
    console.log('Please, specify a file and word');
} else {
    const cg = new cat_greep(process.argv[2], process.argv[3]);
    cg.run();
}
```

## Ejercicio 3 

En mi caso la aplicación de procesamiento de notas en vez de crear una nueva nota como un fichero nuevo lo que hace es introducirlas todas en un único fichero. Por lo tanto a la hora de crear una nueva nota en vez de crear un nuevo fichero, se realiza una modificación del fichero *notas.txt*. Los eventos que emite el objeto `watcher` son *change* en caso de modificar el fichero y *rename* para la creación, cambio de nombre o eliminación de uno.

Lo primero que realiza el programa es gestionar la entrada de argumentos por consola de manera que se deban escribir los dos argumentos necesarios:

```ts
if (process.argv.length !== 4) {
    console.log('Please, specify a username and the route');
} else {
    const a = new notewatch(process.argv[2], process.argv[3]);
    a.run();
}
```

La clase `notewatch` será la que se encargará de realizar el control de cambios. Esta clase tiene como parámetros el nombre del usuario y la ruta donde se almacenan todas las notas de los usuarios. La clase tiene 2 métodos, `f_exist` que comprueba si existe el directorio que se va observar, de esta manera controlamos errores como rutas incorrectas o nombres de usuarios no existentes. El otro método es `run`, el cual se encarga de ejecutar el código principal de la clase. Este verifica si el directorio exite, en caso afirmativo, mediante `watch` observa los cambios en dicho directorio y muestra el archivo que ha sufrido modificación eliminación o creación. Además muestra el tipo de evento generado y dependiendo de este muestra un mensaje por pantalla de los que le ha sucedido al fichero.

```ts
class notewatch {

    constructor(private uname:string , private route:string){}

    run():void {
        if (this.f_exist()) {
            watch(this.route+this.uname, (eventType, filename) => {
                console.log("\nArchivo", filename, "modificado!");
                console.log("Tipo de cambio:", eventType);
                if (eventType == 'change') {console.log('Archivo modificado'); /*process.exit(0)*/}
                if (eventType == 'rename') {console.log('Archivo eliminado, renombrado o creado'); /*process.exit(0)*/}
            });
        }
    }

    f_exist():boolean {
        if (existsSync(this.route+this.uname)) {
            return true;
        } else {
            console.log("No existe el directorio");
            return false;
        }
    }
}
```

Para mostrar el contenido del fichero en caso de ser creado o modificado, podemos usar `spawn` para ejecutar el comando `cat` al ese fichero si antes de eso comprobamos que el tipo de evento es correcto y no ha sido eliminado el fichero.

Si queremos observar todos los directorios, podríamos añadir al código una llamada a `watch` adicional pero en este caso sobre el directorio principal de las notas. De esta manera en uno tendríamos el directorio general y en el otro el directorio específico de un usuario observados al mismo tiempo.

## Ejercicio 4

La aplicación wrapper se va a representar a partir de una clase con los métodos correspondientes y el uso de `yarg` para la gestión de los comandos. La clase no va a tener ningún parámetro.

### Mostrar si es un directorio o un fichero

El método recibirá una ruta y devolverá *true* en caso de fichero y *false* en caso de directorio, además de mostrar un mensaje por consola. Esto lo realiza mediante `statSync`, es este caso se utiliza de forma sícrona ya que si fuera asíncrona no se podría asignar el valor de retorno del método. Ejecutamos `statSync` sobre la ruta y luego usaremos sus propios métodos `isFile` y `isDirectory` para conocer si es fichero o directorio.

```ts
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
```

El comando `check `recibirá la ruta y ejecuta el método.

```ts
handler(argv) {
  if (typeof argv.route === 'string') {
    app.check(argv.route);
  }
}
```

### Crear un nuevo directorio

Para crear un directorio primero se comprueba si ya existe con `existsSync`, en caso negativo a partir de `mkdir` se crear el directorio y se muestra el mensaje de confirmación.

```ts
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
```

El comando `mkdir `recibirá la ruta y ejecuta el método.

```ts
handler(argv) {
      if (typeof argv.route === 'string') {
        app.createDir(argv.route);
      }
    },
```

### Listar los ficheros

En el caso de listar los ficheros de un directorio ussaremois `spawn` para ejecutar un *ls* recursivo para buscar todos los elementos de su arbol y a cada directorio de la salida se le asigna un indicardor */* a partir de la opción *-p*. Tras esto se le pasa la salida del *ls* un *grep* el cual con los parámetros *-v y /*, buscará los elementos que no coincidan con el indicador */* de esta manera solo obtendremos los ficheros. Tras esto mostramos la salida del *grep* usando `on` y obteniendo el evento `data`.

```ts
list(r: string): void {
    const ls = spawn('ls', ['-R','-p',r]);
    const grep = spawn('grep', ['-v', '/']);
    ls.stdout.pipe(grep.stdin);
    grep.stdout.on('data', (info) => {
      console.log(info.toString());
    });
  }
```
El comando `list `recibirá la ruta y comprobará si es un directorio o fichero, en el caso de directorio se ejecuta el método y en el caso de que sea un fichero si alerta con un mensaje.

```ts
handler(argv) {
      if (typeof argv.route === 'string') {
        if (!app.check(argv.route)) {app.list(argv.route)}
        else {console.log('Not a directory')}
      }
    },
```

### Mostrar el contenido de un fichero

Para este método se realizará un `spaw` de comando cat sobre el fichero y a partir de un `on` se obtendrá el evento `data` y mostraremos el contenido por pantalla. El comando `cat` de `yarg` comprobará primero si se trata de un fichero para ejecutar el método, si no lo es alerta con un mensaje.

```ts
cat(r: string): void {
    const cat = spawn('cat', [r]);
    cat.stdout.on('data', (info) => {
      console.log(info.toString());
    });
  }

handler(argv) {
      if (typeof argv.route === 'string') {
        if(app.check(argv.route)) {app.cat(argv.route)}
        else {console.log('Not a file')}
      }
    },
```

### Borrar ficheros y directorios

Para borrar fichero y directorios se han creado dos métodos, uno para borrar un fichero o el otro para un directorio. Funcionan de la misma manera, primero se comprueba si existe el elemento a borrar ya que no s epude borrar algo no existente y luego se ejecuta `rm` en el caso de un fichero o `rmdir` cuando es un directorio, mostrando un mensaje de confirmación.

```ts
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
```

El comando `rm `recibirá la ruta y comprobará si es un directorio o fichero, en el caso de directorio se ejecuta el método `removeDir`y en el caso de que sea un fichero el `removeFile`.

```ts
handler(argv) {
      if (typeof argv.route === 'string') {
        if (app.check(argv.route)) {app.removeFile(argv.route)}
        else {app.removeDir(argv.route)}
      }
    },
```

### Mover y copiar ficheros y/o directorios

En esta ocasión se ha creado dos método, uno para mover y otro para copiar, además de dos comandos distintos. El método `move`, recibe una ruta origen y una ruta de destino. Primero comprueba si la ruta de destino se trata de un directorio y si la ruta de origen que se pasa como fichero se trata de uno. Luego usa `spawn` para realizar un *mv*. En el caso del método `copy` se realiza lo mismo sin embargo se usa `spawn` de *cp* y dependiendo de si el origen se trata de un directorio se realiza una copia recursiva con la opción *-R* para copiar todo el contenido del directorio.

```ts
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
move(r: string, d: string): void {
    if (!this.check(d)) {
      if(this.check(r)) {
        spawn('mv', [r,d]);
      }
    } else {
      console.log('Destination route is not a directory')
    }
  }
```

Los comandos `copy` y `move` reciben como parámetros un origen y un destino y luego ejecutan el método correpondiente.

```ts
handler(argv) {
      if ((typeof argv.route === 'string')&&(typeof argv.destination === 'string')) {
        app.move(argv.route,argv.destination);
      }
    },

handler(argv) {
      if ((typeof argv.route === 'string')&&(typeof argv.destination === 'string')) {
        app.copy(argv.route,argv.destination);
      }
    },
```
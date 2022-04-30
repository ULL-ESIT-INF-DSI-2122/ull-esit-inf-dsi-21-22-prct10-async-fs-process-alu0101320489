/**
 * Funcion que añade una nota
 * @param usuario usuario
 * @param titulo titulo
 * @param data datos
 * @param color color
 */
export declare function add(usuario: string, titulo: string, data: string, color: string): void;
/**
 * Funcion que elimina una nota
 * @param usuario ususario
 * @param titulo titulo
 */
export declare function del(usuario: string, titulo: string): void;
/**
 * Fucnion que modifica una nota
 * @param usuario usuario
 * @param titulo titulo
 * @param data datos
 * @param color color
 */
export declare function mod(usuario: string, titulo: string, data: string, color: string): void;
/**
 * Funcion que lista las notas de un usuario
 * @param usuario usuario
 */
export declare function list(usuario: string): void;
/**
 * Funcion que muestra el contenido de una nota
 * @param usuario usuario
 * @param titulo titulo
 */
export declare function read(usuario: string, titulo: string): void;
/**
 * Funcion que crea un directorio
 * @param u nombre del usuario
 */
export declare function createDir(u: string): void;
/**
 * Funcion que muestra un texto en un color
 * @param c color
 * @param data texto
 */
export declare function printColor(c: string, data: string): void;

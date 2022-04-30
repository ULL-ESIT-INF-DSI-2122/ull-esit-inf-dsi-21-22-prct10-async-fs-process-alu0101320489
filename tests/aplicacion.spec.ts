import 'mocha';
import {expect} from 'chai';

import {printColor} from '../src/aplicacion'
import {createDir} from '../src/aplicacion'
import {add} from '../src/aplicacion'
import {del} from '../src/aplicacion'
import {mod} from '../src/aplicacion'
import {list} from '../src/aplicacion'
import {read} from '../src/aplicacion'
describe('Test funciones de aplicacion', () => {
    
    it ('Funcionamiento de printColor', () => {
        expect(printColor('rojo', 'contenido')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de printColor', () => {
        expect(printColor('verde', 'contenido')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de printColor', () => {
        expect(printColor('azul', 'contenido')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de printColor', () => {
        expect(printColor('amarillo', 'contenido')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de printColor', () => {
        expect(printColor('void', 'contenido')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de createDir', () => {
        expect(createDir('dani')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de add', () => {
        expect(add('daniel', 'nota1', 'verano', 'verde')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de add', () => {
        expect(add('daniel', 'nota1', 'verano', 'verde')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de mod', () => {
        expect(mod('daniel', 'nota1', 'otoño', 'amarillo')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de mod', () => {
        expect(mod('daniel', 'nota2', 'otoño', 'amarillo')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de delete', () => {
        expect(del('daniel', 'nota2')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de delete', () => {
        expect(del('daniel', 'nota1')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de list', () => {
        expect(list('ruben')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de read', () => {
        expect(read('ruben', 'nota1')).to.be.deep.equal(undefined);
    });
    it ('Funcionamiento de read', () => {
        expect(read('ruben', 'nota2')).to.be.deep.equal(undefined);
    });
});
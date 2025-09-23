export enum perfil {
    Duenio = 'Duenio',
    Supervisor = 'Supervisor',
    Empleados = '', //Hacer otro enum para tipos de empleados o verlo de otra manera?
    ClienteRegistrado = 'ClienteRegistrado',
    ClienteAnonimo = 'ClienteAnonimo'
}

export class Usuario {

    public nombre : string;
    public apellido : string;
    public numeroDocumento : number;
    public correo : string;
    public perfil : perfil;

    constructor(nombre: string, apellido: string, numeroDocumento : number, correo: string, perfil: perfil){
        this.nombre = nombre;
        this.apellido = apellido;
        this.numeroDocumento = numeroDocumento;
        this.correo = correo;
        this.perfil = perfil
    }

}
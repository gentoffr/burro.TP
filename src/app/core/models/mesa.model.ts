export enum tipoMesa {
    Estandar = 'Estandar',
    VIP = 'VIP',
    MovilidadReducida = 'MovilidadReducida'
}

export class Mesa {

    public id : number;
    public estado : boolean;
    public tipo : tipoMesa;
    public cantidadComensales : number;
    public numeroMesa : number;

    constructor(id: number, estado: boolean, tipo : tipoMesa, cantidadComensales: number, numeroMesa: number){
        this.id = id;
        this.estado = estado;
        this.tipo = tipo;
        this.cantidadComensales = cantidadComensales;
        this.numeroMesa = numeroMesa
    }

}
export enum perfil {
    Duenio = 'duenio',
    Supervisor = 'supervisor',
    Maitre = 'maitre',
    Mozo = 'mozo',
    Cocinero = 'cocinero',
    Bartender = 'bartender',
    ClienteRegistrado = 'cliente',
    ClienteAnonimo = 'ClienteAnonimo'
}

export class Usuario {
    public id: string;                   
    public nombre: string;
    public apellido: string;
    public documento: number;             
    public email: string;                 
    public perfil?: perfil;               
    public foto_url?: string;             
    public created_at?: string;           
    public updated_at?: string;           

    constructor(
        id: string,
        nombre: string, 
        apellido: string, 
        documento: number, 
        email: string, 
        perfil?: perfil,
        foto_url?: string,
        created_at?: string,
        updated_at?: string
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.documento = documento;
        this.email = email;
        this.perfil = perfil;
        this.foto_url = foto_url;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * Crear Usuario desde datos de Supabase
     */
    static fromSupabase(data: any): Usuario {
        return new Usuario(
            data.id,
            data.nombre,
            data.apellido,
            data.documento,
            data.email,
            data.perfil,
            data.foto_url,
            data.created_at,
            data.updated_at
        );
    }
    toSupabase(): any {
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            documento: this.documento,
            email: this.email,
            perfil: this.perfil,
            foto_url: this.foto_url,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

    get nombreCompleto(): string {
        return `${this.nombre} ${this.apellido}`;
    }

    get tieneFoto(): boolean {
        return !!this.foto_url;
    }
}
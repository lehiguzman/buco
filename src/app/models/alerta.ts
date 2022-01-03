export class Alerta {
    protected _titulo: string;
    protected _contenido: string;
    protected _botonText: string;
    protected _visible: boolean;
    constructor(titulo: string, contenido?: string, visible?: boolean, botonText?: string) {
        this._titulo = titulo;
        this._contenido = contenido || '';
        this._botonText = botonText || 'Continuar';
        this._visible = visible || false;
    }
    get titulo(): string {
        return this._titulo;
    }
    set titulo(titulo: string) {
        this._titulo = titulo;
    }
    get contenido(): string {
        return this._contenido;
    }
    set contenido(contenido: string) {
        this._contenido = contenido;
    }
    get botonText(): string {
        return this._botonText;
    }
    set botonText(botonText: string) {
        this._botonText = botonText;
    }
    get visible(): boolean {
        return this._visible;
    }
    set visible(visible: boolean) {
        this._visible = visible;
    }
}
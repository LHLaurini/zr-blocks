
export class IntializationError extends Error {
    constructor() {
        super("Falha na inicialização. Verifique se o programa foi instalado corretamente.");
    }
}

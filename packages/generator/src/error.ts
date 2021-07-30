
export class IntializationError extends Error {
    constructor() {
        super("Falha na inicialização. Verifique se o programa foi instalado corretamente.");
    }
}

export class UninitializedUsageError extends Error {
    constructor() {
        super("Classe usada antes da inicialização. Isso é um bug.");
    }
}

export class UnexpectedError extends Error {
    constructor() {
        super("ocorreu um erro inesperado");
    }
}

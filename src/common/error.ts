
export class AssemblerError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class LinkerError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class AlreadyResolvedError extends AssemblerError {
    constructor() {
        super("rótulo já resolvido");
    }
}

export class IntializationError extends Error {
    constructor() {
        super("Falha na inicialização. Verifique se o programa foi instalado corretamente.");
    }
}

export class InvalidOperandsError extends AssemblerError {
    constructor() {
        super("combinação de operandos inválida");
    }
}

export class NotANumberError extends AssemblerError {
    constructor() {
        super("valor literal deve ser um número");
    }
}

export class OutOfRangeError extends AssemblerError {
    constructor() {
        super("valor literal fora do permitido");
    }
}

export class OutOfSpaceError extends LinkerError {
    constructor() {
        super("não há mais espaço no binário");
    }
}

export class OverlappingBlockError extends LinkerError {
    constructor() {
        super("blocos fixos se sobrepõem");
    }
}

export class UndefinedLabelError extends AssemblerError {
    constructor() {
        super("rótulo não definido");
    }
}

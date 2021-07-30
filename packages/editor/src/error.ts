
export function exceptionToString(e: unknown) {
    if (e instanceof Error) {
        if (e.stack != undefined) {
            console.log(e.stack);
        }
        return e.message;
    } else {
        return "Um erro inesperado aconteceu.";
    }
}

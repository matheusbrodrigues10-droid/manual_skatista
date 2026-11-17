export function normalizarEmail(email) {
    return typeof email === "string"
        ? email.trim().toLowerCase()
        : "";
}

export function emailGmailValido(email) {
    const emailNormalizado = normalizarEmail(email);
    return /^[^\s@]+@gmail\.com$/.test(emailNormalizado);
}
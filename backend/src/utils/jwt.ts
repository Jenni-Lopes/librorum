import crypto from "crypto";

type JwtPayload = {
    id: number;
    nome: string;
    email: string;
};

const JWT_SECRET = process.env.JWT_SECRET ?? "librorum-dev-secret";
const TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24;

function base64Url(input: Buffer | string) {
    return Buffer.from(input)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function decodeBase64Url(input: string) {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(normalized, "base64").toString("utf8");
}

function sign(data: string) {
    return base64Url(
        crypto
            .createHmac("sha256", JWT_SECRET)
            .update(data)
            .digest()
    );
}

export function gerarToken(usuario: JwtPayload) {
    const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = base64Url(
        JSON.stringify({
            ...usuario,
            exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_SECONDS,
        })
    );
    const signature = sign(`${header}.${payload}`);

    return `${header}.${payload}.${signature}`;
}

export function validarToken(token: string): JwtPayload {
    const [header, payload, signature] = token.split(".");

    if (!header || !payload || !signature) {
        throw new Error("Token inválido.");
    }

    if (signature !== sign(`${header}.${payload}`)) {
        throw new Error("Token inválido.");
    }

    const data = JSON.parse(decodeBase64Url(payload)) as JwtPayload & { exp?: number };

    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("Token expirado.");
    }

    return {
        id: data.id,
        nome: data.nome,
        email: data.email,
    };
}

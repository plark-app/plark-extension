export class InvalidPasswordException extends Error {
    message = 'Invalid password';
    code = 'invalid_password';
}
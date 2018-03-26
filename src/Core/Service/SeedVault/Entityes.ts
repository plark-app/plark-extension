interface VaultDataInterface {

    /**
     * encrypted seed
     */
    seed: string;

    /**
     * MD5 of password for validate
     */
    ph: string;

    /**
     * MD5 of seed for validate
     */
    sh: string;

    /**
     * Salt, used it hashes
     * Temporary not used
     */
    salt?: string;
}

export {
    VaultDataInterface
}
import type { RegisterInput } from '@apiDatabase/types';
export declare class RegisterDto implements RegisterInput {
    email: string;
    password: string;
    name: string;
}

export declare class SignupDto {
    name: string;
    email: string;
    phone: string;
    matric: string;
    password: string;
}
export declare class LoginDto {
    matric: string;
    password: string;
}
export declare class UpdatePasswordDto {
    password: string;
    newPassword: string;
}
export declare class ResetPasswordDto {
    password: string;
}

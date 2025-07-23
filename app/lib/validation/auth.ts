// app/lib/validation/auth.ts
import {z} from 'zod';

// Password policy from Technical-Specification.md
const PASSWORD_POLICY = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: /[A-Z]/,
    requireLowercase: /[a-z]/,
    requireNumbers: /[0-9]/,
    requireSpecialChars: /[^A-Za-z0-9]/,
    forbiddenPatterns: ['password', '123456', 'qwerty', 'artswap'],
};

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(PASSWORD_POLICY.minLength).max(PASSWORD_POLICY.maxLength),
});

export const signupSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z
        .string()
        .min(PASSWORD_POLICY.minLength, 'Password too short')
        .max(PASSWORD_POLICY.maxLength, 'Password too long')
        .refine((val) => PASSWORD_POLICY.requireUppercase.test(val), 'Must include uppercase letter')
        .refine((val) => PASSWORD_POLICY.requireLowercase.test(val), 'Must include lowercase letter')
        .refine((val) => PASSWORD_POLICY.requireNumbers.test(val), 'Must include a number')
        .refine((val) => PASSWORD_POLICY.requireSpecialChars.test(val), 'Must include a special character')
        .refine((val) => !PASSWORD_POLICY.forbiddenPatterns.some((pat) => val.toLowerCase().includes(pat)), 'Password too weak'),
    invitationToken: z.string().optional(),
    profilePicture: z.string().url().optional(),
});

export const passwordResetRequestSchema = z.object({
    email: z.string().email(),
});

export const passwordResetSchema = z.object({
    token: z.string(),
    newPassword: signupSchema.shape.password,
});

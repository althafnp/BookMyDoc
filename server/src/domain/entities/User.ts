import { AuthProvider, UserRole, UserStatus } from "../enums/Auth";

export class User {
    constructor(
        public readonly id: string,
        public name: string,
        public email: string,
        private password: string | undefined,       
        public providers: AuthProvider[],           
        public role: UserRole,
        public status: UserStatus = "ACTIVE",
        public emailVerified: boolean = false,
        public googleId?: string,                   
        public profileImage?: string
    ) { }

    // -------------------------
    // Domain Behavior Methods
    // -------------------------

    // Block / unblock user 
    block() {
        this.status = "BLOCKED";
    }

    unblock() {
        this.status = "ACTIVE";
    }

    // Password behavior
    hasPassword(): boolean {
        return !!this.password;
    }

    getPassword(): string | undefined {
        return this.password;
    }

    changePassword(newPassword: string) {
        this.password = newPassword;
        if (!this.providers.includes("LOCAL")) {
            this.providers.push("LOCAL"); // Automatically add LOCAL provider if not present
        }
        if (!this.emailVerified) {
            this.emailVerified = true; // optional: consider auto-verifying if user sets password after Google signup
        }
    }

    // Provider behavior
    addProvider(provider: AuthProvider, googleId?: string) {
        if (!this.providers.includes(provider)) {
            this.providers.push(provider);
        }
        if (provider === "GOOGLE" && googleId) {
            this.googleId = googleId;
            this.emailVerified = true; // Google email is trusted
        }
    }

    removeProvider(provider: AuthProvider) {
        this.providers = this.providers.filter(p => p !== provider);
        if (provider === "GOOGLE") {
            this.googleId = undefined;
        }
    }

    isProviderLinked(provider: AuthProvider): boolean {
        return this.providers.includes(provider);
    }
}
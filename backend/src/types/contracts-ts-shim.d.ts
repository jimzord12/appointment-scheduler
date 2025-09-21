declare module '../../../specs/001-build-an-web/contracts/api-contracts.ts' {
  import type { ZodTypeAny } from 'zod';
  export const AppointmentRequestSchema: ZodTypeAny;
  export const AuthResponseSchema: ZodTypeAny;
  export const CreateAppointmentRequestSchema: ZodTypeAny;
  export const CreateServiceSchema: ZodTypeAny;
  export const CreateUserSchema: ZodTypeAny;
  export const ErrorResponseSchema: ZodTypeAny;
  export const LoginSchema: ZodTypeAny;
  export const ServiceSchema: ZodTypeAny;
  export const UpdateAppointmentRequestSchema: ZodTypeAny;
  export const UserSchema: ZodTypeAny;
  export const authProcedures: any;
  export const userProcedures: any;
  export const serviceProcedures: any;
  export const appointmentProcedures: any;
}

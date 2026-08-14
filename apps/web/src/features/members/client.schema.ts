import { z } from "zod";
import { ORG_ROLES } from "@apiDatabase/constants";
import type { InviteMemberInput, UpdateRoleInput } from "@apiDatabase/types";

export const inviteSchema = z.object({
  email: z.string().email("Invalid email"),
}) satisfies z.ZodType<InviteMemberInput>;

export const updateRoleSchema = z.object({
  role: z.enum([ORG_ROLES.ADMIN, ORG_ROLES.DEVELOPER]),
}) satisfies z.ZodType<UpdateRoleInput>;

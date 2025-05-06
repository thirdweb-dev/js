import { z } from "zod";

const teamSlugRegex = /^[a-z0-9]+(?:[-][a-z0-9]+)*$/;
const teamNameRegex = /^[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/;

export const maxTeamSlugLength = 48;
const minTeamSlugLength = 3;

export const teamSlugSchema = z
  .string()
  .min(minTeamSlugLength, {
    message: `Team slug must be at least ${minTeamSlugLength} characters`,
  })
  .max(maxTeamSlugLength, {
    message: `Team slug must be at most ${maxTeamSlugLength} characters`,
  })
  .refine((slug) => !slug.includes(" "), {
    message: "Team URL cannot contain spaces",
  })
  .refine((slug) => teamSlugRegex.test(slug), {
    message: "Team URL can only contain lowercase letters, numbers and hyphens",
  });

export const maxTeamNameLength = 32;
const minTeamNameLength = 3;

export const teamNameSchema = z
  .string()
  .min(minTeamNameLength, {
    message: `Team name must be at least ${minTeamNameLength} characters`,
  })
  .max(maxTeamNameLength, {
    message: `Team name must be at most ${maxTeamNameLength} characters`,
  })
  .refine((name) => name.trim() === name, {
    message: "Team name cannot contain leading or trailing spaces",
  })
  .refine((name) => teamNameRegex.test(name), {
    message: "Team name can only contain letters, numbers, spaces and hyphens",
  });

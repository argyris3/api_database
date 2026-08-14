import { redirect } from "next/navigation";
import { retrieveMyOrganizationsFromApi } from "@/features/organization/organization-helpers.server";

export default async function DashboardPage() {
  const orgs = await retrieveMyOrganizationsFromApi();

  console.log("ORG", orgs);

  if (orgs.length === 1) {
    redirect(`/organizations/${orgs[0].slug}/projects`);
  }

  redirect("/organizations");
}

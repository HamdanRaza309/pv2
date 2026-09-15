"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePortfolio() {
  try {
    revalidatePath("/");
    revalidatePath("/engineer");
    revalidatePath("/research");
    revalidatePath("/life");
    revalidatePath("/engineer/projects/[slug]", "page");
    return { success: true };
  } catch (err) {
    console.error("Revalidation error:", err);
    return { success: false, error: String(err) };
  }
}

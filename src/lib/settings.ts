import { unstable_cache, revalidateTag } from "next/cache";
import { getSettings, updateSettings } from "@/lib/db";
import { SiteSettings } from "@/lib/types";

const SETTINGS_CACHE_TAG = "site-settings";

export const getCachedSettings = unstable_cache(
  async () => {
    return getSettings();
  },
  ["site-settings"],
  {
    tags: [SETTINGS_CACHE_TAG],
    revalidate: 3600 // 1 hour fallback
  }
);

export async function updateSettingsWithRevalidate(
  partial: Partial<SiteSettings>
): Promise<SiteSettings> {
  const updated = await updateSettings(partial);
  revalidateTag(SETTINGS_CACHE_TAG, "default");
  return updated;
}

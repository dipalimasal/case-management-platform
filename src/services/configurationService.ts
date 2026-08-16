import uiConfigs from '../mock/ui-configurations.json';
import profilesData from '../mock/screening-profiles.json';
import type { UIConfiguration } from '../types/ui-config';
import type { ScreeningProfile } from '../types/screening';

export async function getUIConfigurations(): Promise<UIConfiguration[]> {
  return uiConfigs as UIConfiguration[];
}

export async function getUIConfigByProfile(uiProfile: string): Promise<UIConfiguration | null> {
  const configs = await getUIConfigurations();
  return configs.find((c) => c.uiProfile === uiProfile) ?? null;
}

export async function getScreeningProfiles(): Promise<ScreeningProfile[]> {
  return profilesData as ScreeningProfile[];
}

export async function getScreeningProfileByType(
  type: string,
): Promise<ScreeningProfile | null> {
  const profiles = await getScreeningProfiles();
  return profiles.find((p) => p.type === type) ?? null;
}

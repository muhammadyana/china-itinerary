export interface GuideSource {
  title: string;
  url: string;
  kind: 'official' | 'operator' | 'reference';
}

export interface GuideCost {
  label: string;
  amount: string;
  detail: string;
  status: 'published' | 'estimate' | 'unconfirmed';
  source?: string;
}

export interface DestinationGuide {
  slug: string;
  name: string;
  region: 'Sichuan' | 'Yunnan';
  placeIds: string[];
  summary: string;
  gettingThere: { origin: string; steps: string[]; duration: string; sources: string[] };
  stopAccess?: Record<string, string>;
  costs: GuideCost[];
  visitDuration: string;
  bestTime: string;
  tips: string[];
  cautions: string[];
  sources: GuideSource[];
  checkedAt: string;
}

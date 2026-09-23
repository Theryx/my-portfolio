import { lazy, type ComponentType, type ReactNode } from 'react';

// A company microsite is a self-contained mini-site: its own shell (nav +
// footer) and its own pages. Each entry below points at one company's module.
// Companies without an entry fall back to the generic single-page brief.
export interface CompanySiteModule {
  Site: ComponentType<{ children: ReactNode }>;
  Loader: ComponentType<{ full?: boolean }>;
  Home: ComponentType;
  Work: ComponentType;
  WorkItem: ComponentType;
  About: ComponentType;
  Writing: ComponentType;
  WritingItem: ComponentType;
}

export const companySites: Record<string, CompanySiteModule> = {
  jito: {
    Site: lazy(() => import('./jito/Site')),
    Loader: lazy(() => import('./jito/Loader')),
    Home: lazy(() => import('./jito/Home')),
    Work: lazy(() => import('./jito/Work')),
    WorkItem: lazy(() => import('./jito/WorkItem')),
    About: lazy(() => import('./jito/About')),
    Writing: lazy(() => import('./jito/Writing')),
    WritingItem: lazy(() => import('./jito/WritingItem')),
  },
  'mtn-cameroon': {
    Site: lazy(() => import('./mtn-cameroon/Site')),
    Loader: lazy(() => import('./mtn-cameroon/Loader')),
    Home: lazy(() => import('./mtn-cameroon/Home')),
    Work: lazy(() => import('./mtn-cameroon/Work')),
    WorkItem: lazy(() => import('./mtn-cameroon/WorkItem')),
    About: lazy(() => import('./mtn-cameroon/About')),
    Writing: lazy(() => import('./mtn-cameroon/Writing')),
    WritingItem: lazy(() => import('./mtn-cameroon/WritingItem')),
  },
};

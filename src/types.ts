export interface Job {
  title: string;
  url: string;
  company: string;
}

export interface CompanyConfig {
  name: string;
  careersUrl: string;
  jobSelectorType: string;
  jobLinkSelector: string;
  waitNetwork?: boolean;
}

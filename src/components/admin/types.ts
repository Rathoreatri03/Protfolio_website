export type CMSFile = 
  | "systemMetadata" 
  | "professionalLinks" 
  | "BannerDetails" 
  | "experience" 
  | "projects" 
  | "researchInsights" 
  | "successStories" 
  | "skillsData" 
  | "techstack"
  | "dodoPromptConfig"
  | "logo";

export interface DBState {
  systemMetadata: { content: any; sha: string };
  professionalLinks: { content: any; sha: string };
  BannerDetails: { content: any; sha: string };
  experience: { content: any[]; sha: string };
  projects: { content: any[]; sha: string };
  researchInsights: { content: any[]; sha: string };
  successStories: { content: any[]; sha: string };
  skillsData: { content: any; sha: string };
  techstack: { content: string[]; sha: string };
  dodoPromptConfig: { content: any; sha: string };
  logo: { content: any; sha: string };
  [key: string]: { content: any; sha: string };
}

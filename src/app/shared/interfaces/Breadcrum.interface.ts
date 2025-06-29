export interface Breadcrumb {
  title?: string;
  subTitle?: string;
  breadcrumb_path?: string;
  currentURL?: string;

  items?: BreadcrumbItem[]; 
}
export interface BreadcrumbItem {
  label: string;
  url?: string; 
}

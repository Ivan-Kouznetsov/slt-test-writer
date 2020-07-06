export interface IFetchParams {
  url: string;
  options?: {
    method: string;
    body?: string;
    headers?: { [key: string]: string };
  };
}

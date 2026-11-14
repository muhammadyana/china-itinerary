export interface ToolOutput {
  content: string;
  isError?: boolean;
  /** A public page the answer can cite in the sources list. */
  source?: { url: string; title: string };
}

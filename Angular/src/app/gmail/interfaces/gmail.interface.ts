export interface Gmail {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  received: string;
  formatDate: string;
  htmlContent: string;
}

export interface Html {
  content: string;
}

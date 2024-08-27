import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Auth, google } from 'googleapis';

@Injectable()
export class GmailService {
  private oAuth2Client: Auth.OAuth2Client;
  private readonly logger = new Logger('GmailService');

  constructor() {
    this.getAccess();
  }

  private getAccess() {
    try {
      this.oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground',
      );

      this.oAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_KEY,
      });

      this.oAuth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log(err);
          return this.logger.error(err);
        }
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getAllEmails() {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
    });

    const messages = response.data.messages;
    let subject = '';
    let from = '';
    let received = '';

    const messagesPromises = messages.map(async (message) => {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });

      if (msg.data.payload) {
        const headers = msg.data.payload.headers;

        let receivedArray = headers
          .find((header) => header.name === 'Received')
          .value.split(';');

        received = receivedArray[receivedArray.length - 1].trim();

        from = headers.find((header) => header.name === 'From').value.trim();

        subject = headers
          .find((header) => header.name === 'Subject')
          .value.trim();
      }

      return {
        id: msg.data.id,
        snippet: msg.data.snippet,
        subject,
        from,
        received,
        formatDate: received ? this.formatDate(received) : null,
        htmlContent: `${process.env.API_HOST}/api/gmails/${msg.data.id}/html`,
      };
    });

    return Promise.all(messagesPromises);
  }

  private formatDate(received: string): string {
    const date = new Date(received);

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  async getEmail(id: string) {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id,
      });

      let subject = '';
      let from = '';
      let received = '';
      let snippet = '';

      if (msg.data.payload) {
        const headers = msg.data.payload.headers;

        let receivedArray = headers
          .find((header) => header.name === 'Received')
          .value.split(';');

        received = receivedArray[receivedArray.length - 1].trim();

        from = headers.find((header) => header.name === 'From').value.trim();

        subject = headers
          .find((header) => header.name === 'Subject')
          .value.trim();

        snippet = msg.data.snippet.trim();
      }

      return {
        id,
        snippet,
        subject,
        from,
        received,
        formatDate: received ? this.formatDate(received) : null,
        htmlContent: `${process.env.API_HOST}/api/gmails/${msg.data.id}/html`,
      };
    } catch (error) {
      this.handleExceptions(error, id);
    }
  }

  private handleExceptions(error: any, id: string) {
    if (error.code === 400) {
      throw new NotFoundException(`Mail with id '${id}' does not exist.`);
    }
    console.log(error);

    this.logger.error(error);
  }

  async getEmailHtml(id: string) {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id,
      });

      let htmlContent = '';
      const payload = msg.data.payload;

      if (payload) {
        const mimeType = msg.data.payload.mimeType;

        if (mimeType === 'text/html') {
          if (payload.body) {
            htmlContent = payload.body.data;
          }
        }

        if (mimeType === 'text/plain') {
          htmlContent = payload.body.data;
        }

        if (
          mimeType === 'multipart/alternative' ||
          mimeType === 'multipart/mixed'
        ) {
          const htmlPart = payload.parts.find((part) => {
            return part.mimeType === 'text/html';
          });

          if (htmlPart && htmlPart.body && htmlPart.body.data) {
            htmlContent = htmlPart.body.data;
          }
        }
      }

      return {
        content: Buffer.from(htmlContent, 'base64url').toString('utf-8'),
      };
    } catch (error) {
      this.handleExceptions(error, id);
    }
  }
}

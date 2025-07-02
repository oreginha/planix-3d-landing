import nodemailer from 'nodemailer';
import { EmailConfig, ContactFormData, ChatMessage } from '../types';

class MailerService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor() {
    this.config = {
      to: process.env.EMAIL_TO || 'hola@planix.com.ar',
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Planix Web',
        email: process.env.EMAIL_FROM_EMAIL || 'noreply@planix.com.ar'
      },
      smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      },
      testMode: process.env.TEST_MODE === 'true',
      testEmail: process.env.TEST_EMAIL
    };

    // Solo crear el transporter si tenemos credenciales SMTP o estamos en modo test
    if (this.config.smtp.auth.user && this.config.smtp.auth.pass) {
      this.transporter = nodemailer.createTransport({
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure,
        auth: {
          user: this.config.smtp.auth.user,
          pass: this.config.smtp.auth.pass
        }
      });
    } else {
      // Crear un transporter de prueba para desarrollo
      this.transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 587,
        secure: false,
        tls: {
          rejectUnauthorized: false
        }
      });
    }
  }

  async sendContactEmail(data: ContactFormData): Promise<boolean> {
    try {
      // Log de entrada de datos
      if (process.env.DEBUG_LOGS === 'true') {
        console.log('➡️ [DEBUG] Entrando a sendContactEmail con datos:', data);
        console.log('➡️ [DEBUG] Configuración SMTP:', this.config);
      }

      // En modo test sin credenciales SMTP, simular envío exitoso
      if (this.config.testMode && (!this.config.smtp.auth.user || !this.config.smtp.auth.pass)) {
        console.log('📧 [MODO TEST] Email de contacto simulado:', {
          to: this.config.testEmail || this.config.to,
          from: data.email,
          name: data.name,
          messageLength: data.message.length
        });
        return true;
      }

      const recipientEmail = this.config.testMode && this.config.testEmail 
        ? this.config.testEmail 
        : this.config.to;

      const subject = `Nuevo contacto desde Planix - ${data.name}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            📧 Nuevo Contacto desde Planix
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.company ? `<p><strong>Empresa:</strong> ${data.company}</p>` : ''}
            ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
          </div>
          
          <div style="background: #fff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6;">${data.message}</p>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              📅 Enviado: ${new Date().toLocaleString('es-AR')}
              ${this.config.testMode ? '<br>🧪 <strong>MODO TEST</strong>' : ''}
            </p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `${this.config.from.name} <${this.config.from.email}>`,
        to: recipientEmail,
        subject: subject,
        html: html,
        replyTo: data.email
      };

      if (process.env.DEBUG_LOGS === 'true') {
        console.log('➡️ [DEBUG] Opciones de envío:', mailOptions);
      }

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.DEBUG_LOGS === 'true') {
        console.log('✅ [DEBUG] Email enviado:', info);
        console.log('📧 Destinatario:', recipientEmail);
      }

      return true;
    } catch (error) {
      console.error('❌ Error enviando email de contacto:', error);
      if (error && typeof error === 'object') {
        console.error('❌ [DEBUG] Error stack:', (error as any).stack);
      }
      return false;
    }
  }

  async sendChatMessage(message: ChatMessage): Promise<boolean> {
    try {
      // En modo test sin credenciales SMTP, simular envío exitoso
      if (this.config.testMode && (!this.config.smtp.auth.user || !this.config.smtp.auth.pass)) {
        console.log('💬 [MODO TEST] Mensaje de chat simulado:', {
          to: this.config.testEmail || this.config.to,
          userName: message.userName,
          userEmail: message.userEmail,
          messageLength: message.message.length
        });
        return true;
      }

      const recipientEmail = this.config.testMode && this.config.testEmail 
        ? this.config.testEmail 
        : this.config.to;

      const subject = `Mensaje de chat - ${message.userName}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
            💬 Nuevo Mensaje de Chat
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Usuario:</strong> ${message.userName}</p>
            ${message.userEmail ? `<p><strong>Email:</strong> <a href="mailto:${message.userEmail}">${message.userEmail}</a></p>` : ''}
            <p><strong>Hora:</strong> ${message.timestamp.toLocaleString('es-AR')}</p>
            ${message.isFirstMessage ? '<p><strong>🔥 Primer mensaje del usuario</strong></p>' : ''}
          </div>
          
          <div style="background: #fff; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6;">${message.message}</p>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              📅 Recibido: ${new Date().toLocaleString('es-AR')}
              ${this.config.testMode ? '<br>🧪 <strong>MODO TEST</strong>' : ''}
            </p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `${this.config.from.name} <${this.config.from.email}>`,
        to: recipientEmail,
        subject: subject,
        html: html,
        replyTo: message.userEmail || this.config.from.email
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.DEBUG_LOGS === 'true') {
        console.log('💬 Email de chat enviado:', info.messageId);
        console.log('💬 Destinatario:', recipientEmail);
      }

      return true;
    } catch (error) {
      console.error('❌ Error enviando email de chat:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // En modo test sin credenciales, simular conexión exitosa
      if (this.config.testMode && (!this.config.smtp.auth.user || !this.config.smtp.auth.pass)) {
        console.log('✅ [MODO TEST] Conexión SMTP simulada - sin credenciales reales');
        return true;
      }

      await this.transporter.verify();
      console.log('✅ Conexión SMTP verificada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en conexión SMTP:', error);
      return false;
    }
  }
}

const mailerService = new MailerService();
export default mailerService;

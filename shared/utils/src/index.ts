import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '@event-system/types';

// Password utilities
export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

// JWT utilities
export class JwtUtils {
  private static readonly SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

  static generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.SECRET, { expiresIn: '15m' });
  }

  static generateRefreshToken(payload: any): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: '7d' });
  }

  static verifyAccessToken(token: string): any {
    return jwt.verify(token, this.SECRET);
  }

  static verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.REFRESH_SECRET);
  }
}

// UUID utilities
export class IdUtils {
  static generateId(): string {
    return uuidv4();
  }

  static generateReservationCode(): string {
    return uuidv4().substring(0, 8).toUpperCase();
  }
}

// Date utilities
export class DateUtils {
  static addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  static addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 3600000);
  }

  static addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 3600000);
  }

  static isExpired(date: Date): boolean {
    return new Date() > date;
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static formatDateTime(date: Date): string {
    return date.toISOString();
  }
}

// API Response utilities
export class ResponseUtils {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message
    };
  }

  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      data,
      message,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }
}

// Validation utilities
export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  static sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, '');
  }
}

// Error utilities
export class ErrorUtils {
  static createError(message: string, statusCode: number = 400): Error & { statusCode: number } {
    const error = new Error(message) as Error & { statusCode: number };
    error.statusCode = statusCode;
    return error;
  }

  static isValidationError(error: any): boolean {
    return error.name === 'ValidationError' || error.statusCode === 400;
  }

  static isAuthError(error: any): boolean {
    return error.statusCode === 401 || error.statusCode === 403;
  }

  static isNotFoundError(error: any): boolean {
    return error.statusCode === 404;
  }
}

// Logging utilities
export class LoggerUtils {
  static info(message: string, data?: any): void {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data || '');
  }

  static error(message: string, error?: any): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || '');
  }

  static warn(message: string, data?: any): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data || '');
  }

  static debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data || '');
    }
  }
}

// Pagination utilities
export class PaginationUtils {
  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static validatePagination(page?: number, limit?: number): { page: number; limit: number } {
    const validatedPage = Math.max(1, page || 1);
    const validatedLimit = Math.min(100, Math.max(1, limit || 10));
    
    return {
      page: validatedPage,
      limit: validatedLimit
    };
  }
}

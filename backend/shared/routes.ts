import { z } from 'zod';
import { insertUserSchema, insertLocationSchema, insertScanSchema, locations, users, scans } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        studentId: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  locations: {
    list: {
      method: 'GET' as const,
      path: '/api/locations',
      responses: {
        200: z.array(z.custom<typeof locations.$inferSelect & { status: 'low' | 'medium' | 'high'; percentage: number }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/locations/:id',
      responses: {
        200: z.custom<typeof locations.$inferSelect & { status: 'low' | 'medium' | 'high'; percentage: number }>(),
        404: errorSchemas.notFound,
      },
    },
    recommend: {
      method: 'GET' as const,
      path: '/api/locations/recommend/best',
      responses: {
        200: z.custom<typeof locations.$inferSelect & { status: 'low' | 'medium' | 'high'; percentage: number }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  scans: {
    create: {
      method: 'POST' as const,
      path: '/api/qr/scan',
      input: z.object({
        qrCode: z.string(),
        type: z.enum(['entry', 'exit']),
      }),
      responses: {
        200: z.object({
          message: z.string(),
          location: z.custom<typeof locations.$inferSelect>(),
        }),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

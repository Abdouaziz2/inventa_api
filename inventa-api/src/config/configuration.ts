export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://inventa_user:inventa_secret_password@postgres:5432/inventa_db?schema=public',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://redis:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'inventa_secret_jwt_key_local_dev_only',
  },
  cors: {
    origins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000,https://inventa.bayecode.com')
      .split(',')
      .map((origin) => origin.trim()),
  },
  wave: {
    merchantBaseUrl: process.env.WAVE_MERCHANT_BASE_URL || 'https://pay.wave.com/m/M_sn_rcEoxhsoOgeM/c/sn/',
    webhookSecret: process.env.WAVE_WEBHOOK_SECRET || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    user: process.env.SMTP_USER || 'inventa@bayecode.com',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Inventa <inventa@bayecode.com>',
  },
});

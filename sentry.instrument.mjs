import * as Sentry from '@sentry/remix';

Sentry.init({
  dsn: 'https://e3f54e7a380c9bd88a6c474f3b66fb60@o4508700259319808.ingest.de.sentry.io/4508700292677712',
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,

  // To use Sentry OpenTelemetry auto-instrumentation
  // default: false
  autoInstrumentRemix: true,

  // Optionally capture action formData attributes with errors.
  // This requires `sendDefaultPii` set to true as well.
  captureActionFormDataKeys: {
    key_x: true,
    key_y: true,
  },
  // To capture action formData attributes.
  sendDefaultPii: true,
});

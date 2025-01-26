import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://e3f54e7a380c9bd88a6c474f3b66fb60@o4508700259319808.ingest.de.sentry.io/4508700292677712",
    tracesSampleRate: 1,
    autoInstrumentRemix: true
})
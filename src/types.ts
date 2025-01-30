export interface SleepRecord {
  ahi: number; // EVENTS (shown as events/hr)
  leakPercentile: number; // MASK SEAL (shown rounded to nearest integer, as L/min)
  leakScore: number;
  maskPairCount: number; // MASK ON/OFF (shown as times)
  maskScore: number;
  sleepScore: number; // MYAIR SCORE (shown as /100)
  startDate: string;
  totalUsage: number; // USAGE HOURS (minutes, shown as hrs and mins)
  usageScore: number;
}

export interface PatientWrapper {
  patient: {
    id: string;
    firstName: string;
    timezoneId: string;
  };
  sleepRecords: {
    items: SleepRecord[];
  };
}

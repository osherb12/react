import { Timestamp } from "firebase/firestore";

export const formatFirebaseTimestamp = (timestamp: Timestamp | Date | string | number) => {
  if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp && '_nanoseconds' in timestamp) {
    const milliseconds = (timestamp as Timestamp).seconds * 1000 + Math.round((timestamp as Timestamp).nanoseconds / 1_000_000);
    return new Date(milliseconds).toLocaleDateString();
  }
  try {
    const date = new Date((timestamp as Timestamp).toDate());
    return date.toLocaleDateString();
  } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return "Invalid Date";
  }
};
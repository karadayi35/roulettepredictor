import { Platform } from "react-native";

export const REVENUECAT_API_KEY = Platform.select({
  ios: "appl_YOUR_REVENUECAT_IOS_API_KEY",
  android: "goog_owTvFdIGeXmmkXEXUTGkGnPWtWc",
});

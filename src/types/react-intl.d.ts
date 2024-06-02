// extend react-intl
import { type TranslationType } from "@/app/translations/en-US";
declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: TranslationType;
    }
  }
}

// extend react-intl
import { type TranslationType } from "@/app/_layout/language-provider/translations/en-US";
declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: TranslationType;
    }
  }
}

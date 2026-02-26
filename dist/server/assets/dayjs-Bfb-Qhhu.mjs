import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

const DUMANGANG_SITE_TITLE = "두만강테니스클럽";
export const DUMANGANG_RULE_START_DATE = "2026-10-01";
export const DUMANGANG_WIN_POINTS = 4;

export const isDumangangSite = () =>
  process.env.NEXT_PUBLIC_SITE_TITLE === DUMANGANG_SITE_TITLE;

// 날짜 비교는 경기 날짜(YYYY-MM-DD, UTC 자정 저장) 기준
export const isDumangangWinOnlyRule = (dateString: string) =>
  isDumangangSite() && dateString >= DUMANGANG_RULE_START_DATE;

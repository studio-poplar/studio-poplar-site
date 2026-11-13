// SaaS の公開ページ（職人ページ・職種一覧）を検索に出すかどうか。
// 労働局への確認・規約・保険が済むまでは出さない（指示書 12章）。済んだら Vercel で DESHIIRI_SAAS_PUBLIC=1 にする。
export const saasPagesIndexed = () => process.env.DESHIIRI_SAAS_PUBLIC === "1";

import { getTranslations } from "next-intl/server";
import { Link } from "../i18n/navigation";
import { LanguageSwitcher } from "./lang-switcher";
import { MobileMenu, type MobileNavItem } from "./mobile-menu";

// Navigation structure — hrefs are locale-independent; labels come from messages
const NAV_ITEMS = [
  { key: "home", href: "/" },
  {
    key: "about",
    href: "/section/about",
    children: [
      { key: "aboutHistory", href: "/section/about/history" },
      { key: "aboutAchievements", href: "/section/about/achievements" },
      { key: "aboutAnnouncements", href: "/section/about/announcements" },
      { key: "aboutAdmission", href: "/section/about/admission" },
      { key: "aboutVacancies", href: "/section/about/vacancies" },
      { key: "aboutReports", href: "/section/about/reports" },
      { key: "aboutLicense", href: "/section/about/license" },
      { key: "aboutInternalEvaluation", href: "/section/about/evaluation" },
      { key: "aboutEvaluationPlan", href: "/section/about/evaluationPlan" },
    ],
  },
  {
    key: "councils",
    href: "/section/councils",
    children: [
      { key: "councilsJointManagement", href: "/section/councils/joint-management" },
      { key: "councilsPedagogical", href: "/section/councils/pedagogical" },
      { key: "councilsParent", href: "/section/councils/parent" },
      { key: "councilsStudent", href: "/section/councils/student" },
      { key: "councilsMethodological", href: "/section/councils/methodological" },
    ],
  },
  {
    key: "staff",
    href: "/section/staff",
    children: [
      { key: "staffLeadership", href: "/section/staff/leadership" },
      { key: "staffTeachers", href: "/section/staff/teachers" },
      { key: "staffQualification", href: "/section/staff/qualification" },
      { key: "staffResearch", href: "/section/staff/research" },
    ],
  },
  {
    key: "resources",
    href: "/section/resources",
    children: [
      { key: "resourcesClassrooms", href: "/section/resources/classrooms" },
      { key: "resourcesLaboratories", href: "/section/resources/laboratories" },
      { key: "resourcesComputerRoom", href: "/section/resources/computer-room" },
      { key: "resourcesGym", href: "/section/resources/gym" },
      { key: "resourcesMedicalRoom", href: "/section/resources/medical-room" },
      { key: "resourcesCafeteria", href: "/section/resources/cafeteria" },
    ],
  },
  {
    key: "learning",
    href: "/section/learning",
    children: [
      { key: "learningExams", href: "/section/learning/exams" },
      { key: "learningMaterials", href: "/section/learning/materials" },
      { key: "learningProjects", href: "/section/learning/projects" },
    ],
  },
  {
    key: "events",
    href: "/section/events",
    children: [
      { key: "eventsNews", href: "/section/events/news" },
      { key: "eventsEvents", href: "/section/events/events" },
    ],
  },
  {
    key: "students",
    href: "/section/students",
    children: [
      { key: "studentsAdvanced", href: "/section/students/advanced" },
      { key: "studentsAwardWinners", href: "/section/students/award-winners" },
      { key: "studentsAlumni", href: "/section/students/alumni" },
    ],
  },
  {
    key: "creativity",
    href: "/section/creativity",
    children: [
      { key: "creativityLiterature", href: "/section/creativity/literature" },
      { key: "creativityDrawing", href: "/section/creativity/drawing" },
      { key: "creativityPhotography", href: "/section/creativity/photography" },
      { key: "creativityHandmade", href: "/section/creativity/handmade" },
    ],
  },
  {
    key: "competitions",
    href: "/section/competitions",
    children: [
      { key: "competitionsOlympiads", href: "/section/competitions/olympiads" },
      { key: "competitionsEssays", href: "/section/competitions/essays" },
      { key: "competitionsQuizzes", href: "/section/competitions/quizzes" },
    ],
  },
  { key: "contact", href: "/section/contact" },
] as const;

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const t = await getTranslations();

  const navData: MobileNavItem[] = NAV_ITEMS.map((item) => ({
    key: item.key,
    href: item.href,
    label: t(`nav.${item.key}` as Parameters<typeof t>[0]),
    children: "children" in item
      ? item.children.map((child) => ({
          key: child.key,
          href: child.href,
          label: t(`nav.${child.key}` as Parameters<typeof t>[0]),
        }))
      : undefined,
  }));

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <img src="/logo.jpg" alt="" />
          </span>
          <span>
            <strong>{t("header.schoolName")}</strong>
          </span>
        </Link>
        <nav className="nav" aria-label={t("header.navAriaLabel")}>
          {NAV_ITEMS.map((item) => {
            const label = t(`nav.${item.key}` as Parameters<typeof t>[0]);
            const hasChildren = "children" in item && item.children.length > 0;
            return (
              <div className="nav-item" key={item.key}>
                <Link className="nav-link" href={item.href}>
                  {label}
                  {hasChildren ? <span className="nav-arrow">▾</span> : null}
                </Link>
                {hasChildren ? (
                  <div className="dropdown" aria-label={`${label} — ${t("header.submenu")}`}>
                    {"children" in item &&
                      item.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          {t(`nav.${child.key}` as Parameters<typeof t>[0])}
                        </Link>
                      ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
        <div className="header-end">
          <LanguageSwitcher />
          <MobileMenu items={navData} />
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div>
          <strong>{t("footer.schoolName")}</strong>
          <p>{t("footer.description")}</p>
        </div>
        <div className="footer-credits">
          <small>{t("footer.madeBy")}</small>
          <strong>{t("footer.madeByName")}</strong>
        </div>
      </footer>
    </>
  );
}

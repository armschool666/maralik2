import { notFound } from "next/navigation";
import { Link } from "../../../../../i18n/navigation";
import { SiteShell } from "../../../../components";
import { sections } from "../../../../data";

export default async function LeadershipPage() {
  const section = sections.find((s) => s.slug === "staff");
  const page = section?.links.find((p) => p.slug === "leadership");

  if (!section || !page) {
    notFound();
  }

  return (
    <SiteShell>
      <section className="subhero subhero--compact">
        <div>
          <Link href={`/section/${section.slug}`}>{section.title}</Link>
          <h1>{page.title}</h1>
        </div>
      </section>

      <section className="section-wrap">
        <div className="director-bio">
          <div className="director-header">
            <p className="director-role">Տնօրեն</p>
            <h2>Աստղիկ Սարիբեկյան</h2>
            <p className="director-born">
              Ծնվել է 1966 թ. օգոստոսի 17-ին, ՀՀ Շիրակի մարզի գյուղ Աշոցքում
            </p>
          </div>

          <div className="bio-section">
            <h3>Կրթություն</h3>
            <ul>
              <li>
                <span className="bio-years">1973–1983</span>
                Սովորել և ավարտել է Աշոցքի միջնակարգ դպրոցը
              </li>
              <li>
                <span className="bio-years">1983–1987</span>
                Ընդունվել և ավարտել է Երևանի Խ. Աբովյանի անվան մանկավարժական
                ինստիտուտի պատմա-աշխարհագրական ֆակուլտետի աշխարհագրության բաժինը
              </li>
            </ul>
          </div>

          <div className="bio-section">
            <h3>Աշխատանքային գործունեություն</h3>
            <ul>
              <li>
                <span className="bio-years">1987–2016</span>
                ՀՀ Շիրակի մարզի Հացիկի միջնակարգ դպրոց — աշխարհագրության ուսուցիչ
              </li>
              <li>
                <span className="bio-years">2000–2016</span>
                ՀՀ Շիրակի մարզի «Հացիկի միջնակարգ դպրոց» ՊՈԱԿ — դաստիարակչական
                աշխատանքների կազմակերպիչ
              </li>
              <li>
                <span className="bio-years">2016–</span>
                ՀՀ Շիրակի մարզի «Հացիկի միջնակարգ դպրոց» ՊՈԱԿ — տնօրեն
              </li>
            </ul>
          </div>

          <div className="bio-section">
            <h3>Կուսակցական պատկանելությունը</h3>
            <p>Անկուսակցական</p>
          </div>

          <div className="bio-section">
            <h3>Անձնական տվյալներ</h3>
            <p>Ամուսնացած է, ունի 2 երեխա:</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

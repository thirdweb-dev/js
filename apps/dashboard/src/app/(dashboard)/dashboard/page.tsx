import { Changelog, type ChangelogItem } from "components/dashboard/Changelog";
import { HomeProductCard } from "components/dashboard/HomeProductCard";
import { OnboardingSteps } from "components/onboarding/Steps";
import { PRODUCTS } from "components/product-pages/common/nav/data";

const TRACKING_CATEGORY = "dashboard";

export default async function Page() {
  const changelog = await getChangelog();

  return (
    <div className="container flex flex-col justify-between gap-16 pt-8 pb-16 xl:flex-row">
      <div className="grow">
        <h1 className="mb-6 font-semibold text-2xl tracking-tight lg:mb-8 lg:text-3xl">
          Get started quickly
        </h1>
        <div className="flex w-full flex-col gap-10">
          <OnboardingSteps />
          <div className="flex w-full flex-col gap-12">
            {["connect", "contracts", "infrastructure"].map((section) => {
              const products = PRODUCTS.filter(
                (p) => p.section === section && !!p.dashboardLink,
              );

              return (
                <div key={section}>
                  <h3 className="mb-2.5 font-medium text-muted-foreground text-xl capitalize tracking-tight">
                    {section === "infrastructure" ? "Engine" : section}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {products.map((product) => (
                      <HomeProductCard
                        key={product.name}
                        product={product}
                        TRACKING_CATEGORY={TRACKING_CATEGORY}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="shrink-0 lg:w-[320px]">
        <h2 className="mb-4 font-semibold text-lg tracking-tight">
          Latest changes
        </h2>
        <Changelog changelog={changelog} />
      </div>
    </div>
  );
}

async function getChangelog() {
  const res = await fetch(
    "https://thirdweb.ghost.io/ghost/api/content/posts/?key=49c62b5137df1c17ab6b9e46e3&fields=title,url,published_at&filter=tag:changelog&visibility:public&limit=5",
  );
  const json = await res.json();
  return json.posts as ChangelogItem[];
}

// revalidate every 5 minutes
export const revalidate = 300;

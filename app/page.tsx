import { Suspense } from "react";

// LOCAL COMPONENT
import { CoinsOverviewFallback, TrendingCoinsFallback } from "@/components/home/fallback";
import CoinsOverview from "@/components/home/CoinsOverview";
import TrendingCoins from "@/components/home/TrendingCoins";

export default async function Homepage() {

    return (
        <main className={"main-container"}>
            <section className="home-grid">
                <Suspense fallback={<CoinsOverviewFallback/>}>
                    <CoinsOverview/>
                </Suspense>

                <Suspense fallback={<TrendingCoinsFallback/>}>
                    <TrendingCoins/>
                </Suspense>
            </section>

            <section className="w-full mt-7 space-y-4">
                <p>Categories</p>
            </section>
        </main>
    );
}

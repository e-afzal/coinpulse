import React from "react";
import Image from "next/image";

// LIB
import { formatCurrency } from "@/lib/utils";

// LOCAL COMPONENT
import { CoinsOverviewFallback } from "@/components/home/fallback";

// ACTION
import { fetcher } from "@/lib/coingecko.actions";

export default async function CoinsOverview() {
    let coin;

    // HANDLE ERROR using Try/Catch
    try {
        coin = await fetcher<CoinDetailsData>("/coins/bitcoin", {
            dex_pair_format: "symbol"
        });
    } catch (error) {
        console.error("Error fetching coin overview:", error);
        return <CoinsOverviewFallback/>;
    }

    // Show UI with data, if no error
    return (
        <div id="coin-overview">
            <div className="header pt-2">
                <Image src={coin.image.large} alt={coin.name} width={56} height={56}/>
                <div className="info">
                    <p>
                        {coin.name} / {coin.symbol.toUpperCase()}
                    </p>
                    <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
                </div>
            </div>
        </div>
    );
}


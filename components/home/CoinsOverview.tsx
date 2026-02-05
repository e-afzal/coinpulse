import Image from "next/image";

// ACTION
import { fetcher } from "@/lib/coingecko.actions";

// LOCAL COMPONENT
import DataTable from "@/components/DataTable";

// UTIL
import { formatCurrency } from "@/lib/utils";

export default async function CoinsOverview() {
    const coin = await fetcher<CoinDetailsData>("/coins/bitcoin", { dex_pair_format: "symbol" });
    return (
        <div className="coin-overview">
            <div className="header pt-2">
                <Image src={coin.image.large} alt={coin.name} width={56} height={56}/>
                <div className="info">
                    <p>{coin.name} / {coin.symbol.toUpperCase()}</p>
                    <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
                </div>
            </div>
        </div>
    );
}

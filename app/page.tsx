import Image from "next/image";
import Link from "next/link";

// LOCAL COMPONENT
import DataTable from "@/components/DataTable";

// ASSETS IMPORT
import { TrendingDown, TrendingUp } from "lucide-react";

// LIB
import { cn, formatCurrency } from "@/lib/utils";

// ACTION
import { fetcher } from "@/lib/coingecko.actions";

// DATA
const columns: DataTableColumn<TrendingCoin>[] = [
    {
        header: "Name",
        cellClassName: "name-cell",
        cell: (coin) => {
            const item = coin.item;
            return (
                <Link href={`/coins/${item.id}`}>
                    <Image src={item.large} alt={item.name} width={36} height={36}/>
                    <p>{item.name}</p>
                </Link>
            );
        }
    },
    {
        header: "24h Change",
        cellClassName: "name-cell",
        cell: (coin) => {
            const item = coin.item;
            const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;
            return (
                <div className={cn("price-change", isTrendingUp ? "text-green-500" : "text-red-500")}>
                    <p>
                        {isTrendingUp ? <TrendingUp width={16} height={16}/> : <TrendingDown width={16} height={16}/>} {Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%</p>
                </div>
            );
        }
    },
    {
        header: "Price Change",
        cellClassName: "price-cell",
        cell: (coin) => `$${coin.item.data.price.toLocaleString()}`
    }
];
const dummyTrendingCoins: TrendingCoin[] = [
    {
        item: {
            id: "bitcoin", name: "Bitcoin", symbol: "BTC", market_cap_rank: 1, thumb: "/logo.svg", large: "/logo.svg", data: { price: 89113.00, price_change_percentage_24h: { usd: 2.5 } }
        }
    },
    {
        item: {
            id: "ethereum", name: "Ethereum", symbol: "ETH", market_cap_rank: 2, thumb: "/logo.svg", large: "/logo.svg", data: { price: 2500.00, price_change_percentage_24h: { usd: -1.2 } }
        }
    }
];

export default async function Homepage() {
    const coin = await fetcher<CoinDetailsData>("/coins/bitcoin", { dex_pair_format: "symbol" });

    return (
        <main className={"main-container"}>
            <section className="home-grid">
                <div className="coin-overview">
                    <div className="header pt-2">
                        <Image src={coin.image.large} alt={coin.name} width={56} height={56}/>
                        <div className="info">
                            <p>{coin.name} / {coin.symbol.toUpperCase()}</p>
                            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
                        </div>
                    </div>
                </div>
                <p>Trending Coins</p>
                <DataTable
                    data={dummyTrendingCoins}
                    columns={columns}
                    rowKey={(coin) => coin.item.id}
                    tableClassName="trending-coins-table"
                />
            </section>

            <section className="w-full mt-7 space-y-4">
                <p>Categories</p>
            </section>
        </main>
    );
}

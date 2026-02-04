"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// LIB
import { cn } from "@/lib/utils";

export default function Header() {
    const pathname = usePathname();
    return (
        <header>
            <div className="main-container inner">
                <Link href="/" className={cn("nav-link", {
                        "is-active": pathname === "/",
                        "is-home": true
                    }
                )}>
                    <Image src="/logo.svg" alt="CoinPulse logo" width={132} height={40}/>
                </Link>

                <nav>
                    <Link href="/">Home</Link>

                    <p>Search Modal</p>

                    <Link href="/coins" className={cn("nav-link", {
                            "is-active": pathname === "/coins",
                            "is-home": true
                        }
                    )}>All Coins</Link>
                </nav>
            </div>
        </header>
    );
}

"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  GithubIcon,
  HamburgerIcon,
} from "lucide-react";
import { marketingConfig } from "@/config/marketing.config";
import { siteConfig } from "@/config/site.config";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeToggler from "@/components/theme/toggler";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsConfig, type DocsNavItem } from "@/config/docs.config";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const space = pathname.split("/").filter(Boolean)[0];
  const sections = docsConfig[space] ?? [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="block md:hidden size-8">
        <HamburgerIcon className="mx-1" />
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="w-full text-left mb-2">
            <Link href="/">
              <h1 className="text-lg md:text-xl font-bold">
                {siteConfig.name}
              </h1>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col">
          {marketingConfig.map((item) => (
            <NavItemComponent
              key={item.title}
              title={item.title}
              href={item.href ?? ""}
              setOpen={setOpen}
            />
          ))}
        </div>
        <Separator className="my-2" />
        {sections.map((section) => (
          <div className="flex flex-col" key={section.title}>
            <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">
              {section.title}
            </p>
            {section.items.map((item) => (
              <MobileDocsItem
                key={item.href ?? item.segment}
                item={item}
                setOpen={setOpen}
              />
            ))}
          </div>
        ))}
        {sections.length > 0 && <Separator className="my-2" />}
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full" asChild>
            <a href={siteConfig.socials.github} target="_blank">
              <GithubIcon />
            </a>
          </Button>
          <ThemeToggler />
        </div>
      </SheetContent>
    </Sheet>
  );
}

const MobileDocsItem = ({
  item,
  setOpen,
  depth = 0,
}: {
  item: DocsNavItem;
  setOpen: (open: boolean) => void;
  depth?: number;
}) => (
  <div>
    {item.href ? (
      <NavItemComponent
        title={item.title}
        href={item.href}
        setOpen={setOpen}
        depth={depth}
      />
    ) : (
      <p
        className="py-1 text-sm font-semibold text-muted-foreground"
        style={{ paddingLeft: `${depth * 0.75}rem` }}
      >
        {item.title}
      </p>
    )}
    {item.items?.map((child) => (
      <MobileDocsItem
        key={child.href ?? `${item.segment}/${child.segment}`}
        item={child}
        setOpen={setOpen}
        depth={depth + 1}
      />
    ))}
  </div>
);

const NavItemComponent = ({
  title,
  href,
  setOpen,
  depth = 0,
}: {
  title: string;
  href: string;
  setOpen: (open: boolean) => void;
  depth?: number;
}) => {
  const pathname = usePathname();
  const active =
    pathname === href || (pathname.startsWith(href) && href !== "/");

  return (
    <Link
      href={href}
      className={cn(
        "relative py-1 cursor-pointer",
        "transition-all duration-200 ease-out"
      )}
      onClick={() => setOpen(false)}
      style={{ paddingLeft: `${depth * 0.75}rem` }}
    >
      <span
        className={cn(
          "relative z-10 mix-blend-difference text-background dark:text-foreground/70",
          active ? "text-background dark:text-foreground font-semibold" : ""
        )}
      >
        {title}
      </span>
    </Link>
  );
};

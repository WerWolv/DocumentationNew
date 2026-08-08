"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { docsConfig, documentationRoots, type DocsNavItem } from "@/config/docs.config";

function SidebarNavItem({
  item,
  pathname,
  nested = false,
}: {
  item: DocsNavItem;
  pathname: string;
  nested?: boolean;
}) {
  const children = item.items?.length ? (
    <SidebarMenuSub>
      {item.items.map((child) => (
        <SidebarNavItem
          key={child.href ?? `${item.segment}/${child.segment}`}
          item={child}
          pathname={pathname}
          nested
        />
      ))}
    </SidebarMenuSub>
  ) : null;

  if (nested) {
    return (
      <SidebarMenuSubItem>
        {item.href ? (
          <SidebarMenuSubButton asChild isActive={item.href === pathname}>
            <Link href={item.href}>{item.title}</Link>
          </SidebarMenuSubButton>
        ) : (
          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
            {item.title}
          </div>
        )}
        {children}
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem>
      {item.href ? (
        <SidebarMenuButton asChild isActive={item.href === pathname}>
          <Link href={item.href}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      ) : (
        <div className="flex h-8 items-center px-2 text-sm font-medium text-muted-foreground">
          {item.title}
        </div>
      )}
      {children}
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const space = pathname.split("/").filter(Boolean)[0];
  const sections = [
    { title: "Documentation", items: documentationRoots },
    ...(docsConfig[space] ?? []),
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.href ?? item.segment}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

import {ThemeProvider} from "@src/components/theme-provider";
import {SidebarProvider} from "@src/components/ui/sidebar";
import type {ReactNode} from "react";
import {Toaster} from "sonner";
import {useSidebarContents} from "@src/hooks/use-sidebar-contents";
import {Breadcrumbs} from "@src/components/breadcrumbs";

interface PageLayoutProps {
  element: ReactNode;
  title: string;
  description: string;
}

export default function PageLayout({
                                     element,
                                     title,
                                     description,
                                   }: PageLayoutProps) {
  const groups = useSidebarContents();

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <Toaster/>
          <div className={`px-[2%] pt-8 w-[100%]`}>
            <header className={"w-[100%] flex justify-center items-center gap-x-4"}>
              <div className={"flex-grow"}>
                <h1 className={"text-3xl font-bold flex items-center gap-x-2"}>
                  <img alt={'Connect Logo'} src={'/SpiralLogo.png'} className={'size-8 inline mt-0.5'}/>
                  {title}
                </h1>
                <Breadcrumbs className={"mt-2"}/>
              </div>
            </header>
            <hr className={"border-0.5 my-4"}/>
            <main>{element}</main>
          </div>
        </SidebarProvider>
      </ThemeProvider>
  );
}

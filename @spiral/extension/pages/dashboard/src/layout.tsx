import {ThemeProvider} from "@src/components/theme-provider";
import {SidebarProvider} from "@src/components/ui/sidebar";
import {AppSidebar} from "@src/components/app-sidebar";
import {ReactNode} from "react";
import {Toaster} from "sonner";
import {useSidebarContents} from "@src/hooks/use-sidebar-contents";
import {Breadcrumbs} from "@src/components/breadcrumbs";
import ProfileIcon from "@src/components/profile-icon";

interface PageLayoutProps {
  element: ReactNode;
  title: string;
  description: string;
}

export default function PageLayout({element, title, description}: PageLayoutProps) {
  const groups = useSidebarContents();

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <Toaster/>
          <AppSidebar  groups={groups}/>
          <div className={`px-[2%] pt-8 w-[100%]`}>
            <header className={"w-[100%] flex"}>
              <div className={"flex-grow"}>
                <h1 className={"text-3xl font-bold"}>{title}</h1>
                <h2 className={"text-lg text-brand-light"}>{description}</h2>
                <Breadcrumbs className={"mt-2"}/>
              </div>
              <div>
                <ProfileIcon/>
              </div>
            </header>
            <hr className={"border-0.5 my-4"}/>
            <main>
              {element}
            </main>
          </div>
        </SidebarProvider>
      </ThemeProvider>
  );

}


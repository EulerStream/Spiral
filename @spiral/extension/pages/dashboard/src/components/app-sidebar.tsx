import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@src/components/ui/sidebar"

import SpiralLogo from '../assets/SpiralLogo.png';
import {ComponentProps} from "react";
import {useLocation} from "react-router";
import {getPath} from "@src/lib/utils";


export interface MenuItem {
  title: string;
  url: string;
  icon: any;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
  icon: any;
}


function createSidebarGroup(title: string, items: MenuItem[]) {
  const location = useLocation();

  return (
      <SidebarGroup key={title} className={"[&:not(:first-child)]:mt-4"}>
        <SidebarGroupLabel className={"text-base font-normal flex items-center justify-center mb-4"}>
          <hr className={"flex-grow mt-1"}/>
          <h4 className={"px-4"}>{title}</h4>
          <hr className={"flex-grow mt-1"}/>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className={"flex gap-y-2"}>
            {items.map((item) => {
              const isSelected = item.url === location.pathname;
              return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                          style={isSelected ? {color: "rgb(40,40,40)"} : {}}
                          className={isSelected ? "bg-brand" : ""}
                          href={item.url.startsWith("/") ? getPath(item.url) : item.url}
                      >
                        <item.icon style={{width: "20px", height: "20px"}}/>
                        <span className={"text-lg ml-2"}>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
  )
}

interface IAppSidebarProps extends ComponentProps<"div"> {
  groups: MenuGroup[];
}

export function AppSidebar(props: IAppSidebarProps) {
  const {groups, ...rest} = props;

  return (
      <Sidebar {...rest}>
        <SidebarHeader className={"flex gap-x-3 p-3 pb-0 flex-col justify-center items-center mt-5 -mb-4"}>
          <span className={"font-bold text-3xl font-urban inline-block text-ce"}>Euler Spiral</span>
          <a className={"select-none"} href={getPath("/")}>
            <img alt={"Logo"} src={SpiralLogo} className={"select-none h-[64px] w-[64px] font-bold -mt-2 -mb-1"}/>
          </a>
        </SidebarHeader>
        <SidebarContent className={"p-4"}>
          {groups.filter(group => group.items.length > 0).map((group) => createSidebarGroup(group.title, group.items))}
        </SidebarContent>
        <SidebarFooter/>
      </Sidebar>
  )
}

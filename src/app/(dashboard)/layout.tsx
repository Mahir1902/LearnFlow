import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col">
          <div>
            <SidebarTrigger className="-ml-1" />
          </div>
          <main className="flex-1 flex pt-0 overflow-hidden">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <AppHeader />
      <PageContainer className="grid place-items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>MentorDesk</CardTitle>
            <CardDescription>
              Submit projects and get them reviewed by mentors.
            </CardDescription>
          </CardHeader>
        </Card>
      </PageContainer>
    </>
  );
}

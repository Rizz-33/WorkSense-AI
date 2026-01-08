import AIInsightsCard from "@/components/dashboard/AIInsightsCard";
import BurnoutRiskCard from "@/components/dashboard/BurnoutRiskCard";
import ProductivityTrendCard from "@/components/dashboard/ProductivityTrendCard";
import ReflectionCard from "@/components/dashboard/ReflectionCard";
import Header from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            AI-powered workload and burnout intelligence
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <ReflectionCard />
          <BurnoutRiskCard />
          <ProductivityTrendCard />
          <AIInsightsCard />
        </div>
      </main>
    </div>
  );
};

export default Index;

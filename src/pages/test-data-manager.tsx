import Layout from "@/components/Layout";
import TestDataManager from "@/components/TestDataManager";

export default function TestDataManagerPage() {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Test-Daten Verwaltung</h1>
        <TestDataManager />
      </div>
    </Layout>
  );
}

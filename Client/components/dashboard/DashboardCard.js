import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export function DashboardCard({ title, children, className = "", headerAction }) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {headerAction}
        </CardHeader>
      )}
      <CardBody>{children}</CardBody>
    </Card>
  );
}

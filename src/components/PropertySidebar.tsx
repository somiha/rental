import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AgentCard } from "./AgentCard";
import { PropertyTypeFilter } from "./PropertyFilter";

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface SidebarProps {
  propertyTypes: string[];
  agents: Agent[];
}

export function Sidebar({ propertyTypes, agents }: SidebarProps) {
  return (
    <aside className="space-y-8">
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Property Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyTypeFilter types={propertyTypes} />
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Our Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-center space-x-4 p-2 rounded-md hover:bg-primary-50">
      <Avatar className="h-12 w-12 border-2 border-primary-100">
        <AvatarImage src={`/agents/${agent.id}.jpg`} alt={agent.name} />
        <AvatarFallback className="bg-primary-100 text-primary-600">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{agent.name}</h3>
        <p className="text-sm text-gray-500">{agent.email}</p>
        <p className="text-sm text-gray-400">{agent.phone}</p>
      </div>
    </div>
  );
}

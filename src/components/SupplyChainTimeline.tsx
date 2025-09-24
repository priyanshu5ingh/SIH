import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, AlertCircle, MapPin, Calendar, User, Thermometer } from "lucide-react";

interface SupplyChainEvent {
  id: string;
  stage: string;
  actor_name: string;
  location: string;
  timestamp: string;
  temperature: number | null;
  humidity: number | null;
  notes: string | null;
  verification_status: string;
  blockchain_hash: string | null;
  product: {
    name: string;
    product_id: string;
  };
}

const SupplyChainTimeline = () => {
  const [events, setEvents] = useState<SupplyChainEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupplyChainEvents();
  }, []);

  const fetchSupplyChainEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("supply_chain_events")
        .select(`
          *,
          product:products(name, product_id)
        `)
        .order("timestamp", { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching supply chain events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStageIcon = (stage: string) => {
    const icons: Record<string, React.ReactNode> = {
      cultivation: <span className="text-green-500">🌱</span>,
      harvesting: <span className="text-yellow-500">🌾</span>,
      processing: <span className="text-blue-500">⚙️</span>,
      packaging: <span className="text-purple-500">📦</span>,
      distribution: <span className="text-orange-500">🚛</span>,
      retail: <span className="text-red-500">🏪</span>,
    };
    return icons[stage] || <span>📍</span>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
          <p className="text-muted-foreground">Loading supply chain events...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No events yet</h3>
        <p className="text-muted-foreground">
          Supply chain events will appear here as products move through the system
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
        
        {events.map((event, index) => (
          <div key={event.id} className="relative flex items-start gap-4 pb-6">
            {/* Timeline dot */}
            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-background border-2 border-border rounded-full">
              {getStageIcon(event.stage)}
            </div>
            
            {/* Event card */}
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold capitalize flex items-center gap-2">
                      {event.stage}
                      {getStatusIcon(event.verification_status)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.product?.name} ({event.product?.product_id})
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(event.verification_status)} text-white`}>
                    {event.verification_status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{event.actor_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(event.timestamp).toLocaleString()}</span>
                  </div>

                  {(event.temperature || event.humidity) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Thermometer className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {event.temperature && `${event.temperature}°C`}
                        {event.temperature && event.humidity && ", "}
                        {event.humidity && `${event.humidity}% RH`}
                      </span>
                    </div>
                  )}
                </div>

                {event.notes && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.notes}
                  </p>
                )}

                {event.blockchain_hash && (
                  <div className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded">
                    Blockchain: {event.blockchain_hash.substring(0, 40)}...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplyChainTimeline;
import { Package, DollarSign, ClipboardList, CreditCard, MapPin, BarChart3 } from 'lucide-react'; // Updated icons
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";

const features = [
  {
    icon: <Package className="h-8 w-8 text-blue-600" />,
    title: "Automated Shipment Creation",
    description:
      "Quickly create shipments by entering details like origin, destination, cargo type, load, and special requirements, streamlining the process and reducing manual effort.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-blue-600" />,
    title: "Carrier Bid Management",
    description:
      "Invite carriers to bid on shipments, ensuring competitive pricing and service quality. Compare bids on price, delivery time, and reputation to select the best deal.",
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-blue-600" />,
    title: "Smart Contract Integration",
    description:
      "Automatically generate smart contracts upon bid acceptance to ensure secure, transparent agreements between shippers and carriers.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Seamless Payment Options",
    description:
      "Flexible payment methods, including crypto wallets and traditional gateways, for secure and hassle-free transactions.",
  },
  {
    icon: <MapPin className="h-8 w-8 text-blue-600" />,
    title: "Real-Time Shipment Tracking",
    description:
      "Provides live updates on shipment status, from pickup to delivery, ensuring full transparency and peace of mind.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Performance Analytics and Insights",
    description:
      "Delivers actionable insights on past shipments, carrier performance, and cost trends to optimize future shipping decisions.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Top Features of ShipAssure
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simplifying logistics with cutting-edge solutions
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-2 inline-block p-3">
                  {feature.icon} {/* Blue icons */}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

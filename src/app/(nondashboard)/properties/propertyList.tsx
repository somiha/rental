import { Sidebar } from "@/components/PropertySidebar";
import { PropertyList } from "@/components/PropertyList";
import { properties } from "@/data/properties";

import { agents } from "@/data/properties";
import { propertyTypes } from "@/data/properties";

export default function LuxuryPropertyListingPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      {/* <header className="bg-primary-600 text-primary-50 py-8 px-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">LUXURY ESTATES</h1>
          <p className="text-primary-100 mt-2">Featured Properties</p>
        </div>
      </header> */}

      <main className="container mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-4 gap-2">
        {/* Property List */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Properties
            </h2>
          </div>

          <PropertyList properties={properties} />

          {/* Pagination could go here */}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 sticky top-24">
          <Sidebar propertyTypes={propertyTypes} agents={agents} />
        </div>
        <div className="lg:col-span-1 sticky top-24"></div>
      </main>
    </div>
  );
}

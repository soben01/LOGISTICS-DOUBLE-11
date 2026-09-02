export interface Checkpoint {
  id: string;
  timestamp: string;
  status: 'Order Placed' | 'Picked Up' | 'Hub Received' | 'Export Cleared' | 'In Flight' | 'At Sea' | 'Import Cleared' | 'Out for Delivery' | 'Delivered' | 'Delayed';
  location: string;
  description: string;
  isCompleted: boolean;
}

export interface Shipment {
  id: string;
  service: 'Double 11 Super Express' | 'Cross-Border Air Priority' | 'Ocean Container FCL' | 'Smart Hub Fulfillment';
  serviceCode: 'EXP' | 'AIR' | 'SEA' | 'FUL';
  status: 'In Transit' | 'Out for Delivery' | 'Customs Cleared' | 'Delivered' | 'Pending Pickup' | 'Exception';
  origin: {
    city: string;
    country: string;
    hub: string;
  };
  destination: {
    city: string;
    country: string;
    hub: string;
    postalCode: string;
  };
  sender: {
    name: string;
    company: string;
    phone: string;
  };
  recipient: {
    name: string;
    company: string;
    address: string;
    phone: string;
  };
  cargo: {
    pieces: number;
    weightKg: number;
    volumeCbm: number;
    description: string;
    declaredValueUsd: number;
    hazardClass?: string;
  };
  telemetry: {
    flightVesselNumber: string;
    airwayBill: string;
    containerUnit?: string;
    estimatedArrival: string;
    temperatureCelsius?: number;
    currentSpeedKmh?: number;
  };
  checkpoints: Checkpoint[];
  proofOfDelivery?: {
    deliveredAt: string;
    receivedBy: string;
    signatureText: string;
  };
}

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'D11-8892-EXP',
    service: 'Double 11 Super Express',
    serviceCode: 'EXP',
    status: 'In Transit',
    origin: {
      city: 'Hong Kong',
      country: 'HKG',
      hub: 'HKG Air Freight Hub 1',
    },
    destination: {
      city: 'Los Angeles',
      country: 'USA',
      hub: 'LAX Gateway Hub B',
      postalCode: '90045',
    },
    sender: {
      name: 'Global Tech Components Ltd',
      company: 'Apex Silicon Global',
      phone: '+852 2891 4401',
    },
    recipient: {
      name: 'Elena Rostova',
      company: 'Pacific Robotics Corp',
      address: '1420 Century Blvd, Suite 400, Los Angeles, CA',
      phone: '+1 310 555 0192',
    },
    cargo: {
      pieces: 6,
      weightKg: 28.5,
      volumeCbm: 0.12,
      description: 'Precision AI Server Sensor Modules & Optics',
      declaredValueUsd: 14800,
    },
    telemetry: {
      flightVesselNumber: 'D11-Cargo CX884 (B777-Freighter)',
      airwayBill: 'AWB-111-9042-8892',
      containerUnit: 'PMC-8911-D11',
      estimatedArrival: 'Tomorrow at 16:30 PST',
      temperatureCelsius: 19.4,
      currentSpeedKmh: 890,
    },
    checkpoints: [
      {
        id: 'cp-5',
        timestamp: 'Sep 02, 2026 - 19:40 HKT',
        status: 'In Flight',
        location: 'Pacific Air Corridor (FL340)',
        description: 'Trans-Pacific flight en route from HKG to LAX. Telemetry active.',
        isCompleted: true,
      },
      {
        id: 'cp-4',
        timestamp: 'Sep 02, 2026 - 16:15 HKT',
        status: 'Export Cleared',
        location: 'Hong Kong International (HKG)',
        description: 'Double 11 Fast-Track Customs export clearance verified & sealed.',
        isCompleted: true,
      },
      {
        id: 'cp-3',
        timestamp: 'Sep 02, 2026 - 13:00 HKT',
        status: 'Hub Received',
        location: 'Shenzhen-HK Border Mega-Sort Hub',
        description: 'High-speed automated X-ray security scanning and dimensioning complete.',
        isCompleted: true,
      },
      {
        id: 'cp-2',
        timestamp: 'Sep 02, 2026 - 09:30 HKT',
        status: 'Picked Up',
        location: 'Shenzhen High-Tech Park',
        description: 'Courier collected consignment via Double 11 Electric Fleet.',
        isCompleted: true,
      },
      {
        id: 'cp-1',
        timestamp: 'Sep 01, 2026 - 22:15 HKT',
        status: 'Order Placed',
        location: 'Double 11 Cloud System',
        description: 'Waybill generated and pre-customs documentation filed.',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'D11-4410-SEA',
    service: 'Ocean Container FCL',
    serviceCode: 'SEA',
    status: 'In Transit',
    origin: {
      city: 'Shanghai',
      country: 'CHN',
      hub: 'Yangshan Deepwater Port',
    },
    destination: {
      city: 'Rotterdam',
      country: 'NLD',
      hub: 'Rotterdam Maasvlakte Terminal',
      postalCode: '3199 LK',
    },
    sender: {
      name: 'East Ocean E-Commerce Logistics',
      company: 'Double 11 Supply Chain Marine',
      phone: '+86 21 6888 3211',
    },
    recipient: {
      name: 'Marc van der Meer',
      company: 'EuroLogix Mega-Distribution BV',
      address: 'Europaweg 900, Port of Rotterdam, Netherlands',
      phone: '+31 10 789 2200',
    },
    cargo: {
      pieces: 1240,
      weightKg: 18600,
      volumeCbm: 68.0,
      description: 'Double 11 Festival Consumer Electronics & Smart Home Gear (40ft High Cube Container)',
      declaredValueUsd: 385000,
    },
    telemetry: {
      flightVesselNumber: 'MV D11-TITAN (Voyage 2608W)',
      airwayBill: 'BOL-D11-SH-RT-4410',
      containerUnit: 'D11U-984210-9 (40HC)',
      estimatedArrival: 'Sep 14, 2026 - 08:00 CET',
      currentSpeedKmh: 35,
    },
    checkpoints: [
      {
        id: 'cp-sea-3',
        timestamp: 'Sep 02, 2026 - 08:00 UTC',
        status: 'At Sea',
        location: 'Malacca Strait Transit',
        description: 'Vessel cruising at 19 knots, ocean telemetry and container locks intact.',
        isCompleted: true,
      },
      {
        id: 'cp-sea-2',
        timestamp: 'Aug 29, 2026 - 18:30 CST',
        status: 'Export Cleared',
        location: 'Yangshan Port, Shanghai',
        description: 'Container gantry-crane loaded aboard MV D11-TITAN.',
        isCompleted: true,
      },
      {
        id: 'cp-sea-1',
        timestamp: 'Aug 27, 2026 - 11:00 CST',
        status: 'Hub Received',
        location: 'Pudong Smart Consolidation Yard',
        description: 'Full container load sealed with smart GPS tamper-proof e-seal.',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'D11-9921-AIR',
    service: 'Cross-Border Air Priority',
    serviceCode: 'AIR',
    status: 'Out for Delivery',
    origin: {
      city: 'Tokyo',
      country: 'JPN',
      hub: 'Narita Sky Logistics Hub',
    },
    destination: {
      city: 'Singapore',
      country: 'SGP',
      hub: 'Changi Airfreight Centre',
      postalCode: '819642',
    },
    sender: {
      name: 'Kenji Takahashi',
      company: 'Nippon Precision Optics',
      phone: '+81 3 5555 8899',
    },
    recipient: {
      name: 'Sarah Tan',
      company: 'Astra Bio-Medical Singapore',
      address: '21 Biopolis Road, Nucleos Tower, Singapore 138567',
      phone: '+65 6789 0123',
    },
    cargo: {
      pieces: 2,
      weightKg: 8.2,
      volumeCbm: 0.04,
      description: 'Temperature-Controlled Bio-Medical Optical Scopes',
      declaredValueUsd: 32000,
    },
    telemetry: {
      flightVesselNumber: 'D11 Express Courier Van #SG-44',
      airwayBill: 'AWB-111-7712-9921',
      estimatedArrival: 'Today at 17:15 SGT (In ~45 mins)',
      temperatureCelsius: 4.1,
    },
    checkpoints: [
      {
        id: 'cp-air-5',
        timestamp: 'Sep 02, 2026 - 15:30 SGT',
        status: 'Out for Delivery',
        location: 'Central Singapore Delivery Zone',
        description: 'Courier assigned: David Lim (Contact: +65 9123 4567). Delivery vehicle en route.',
        isCompleted: true,
      },
      {
        id: 'cp-air-4',
        timestamp: 'Sep 02, 2026 - 11:45 SGT',
        status: 'Import Cleared',
        location: 'Changi Airport Customs Facility',
        description: 'Expedited customs clearance completed. Transferred to local distribution van.',
        isCompleted: true,
      },
      {
        id: 'cp-air-3',
        timestamp: 'Sep 02, 2026 - 06:10 SGT',
        status: 'Hub Received',
        location: 'Singapore Changi Gateway',
        description: 'Flight D11-701 arrived from Tokyo Narita on schedule.',
        isCompleted: true,
      },
      {
        id: 'cp-air-2',
        timestamp: 'Sep 01, 2026 - 23:30 JST',
        status: 'Export Cleared',
        location: 'Tokyo Narita (NRT)',
        description: 'Cargo palletized and secured into refrigerated LD3 container.',
        isCompleted: true,
      },
      {
        id: 'cp-air-1',
        timestamp: 'Sep 01, 2026 - 17:00 JST',
        status: 'Picked Up',
        location: 'Tokyo Ginza Technology District',
        description: 'Special courier pickup with cold-chain monitoring initiated.',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'D11-2041-LOC',
    service: 'Smart Hub Fulfillment',
    serviceCode: 'FUL',
    status: 'Delivered',
    origin: {
      city: 'Shenzhen',
      country: 'CHN',
      hub: 'Baoan Automated Fulfillment Park',
    },
    destination: {
      city: 'London',
      country: 'GBR',
      hub: 'Heathrow Logistics Centre',
      postalCode: 'EC2A 4NE',
    },
    sender: {
      name: 'Double 11 Global Fulfillment Direct',
      company: 'D11 Express Hub Direct',
      phone: '+86 755 8899 0011',
    },
    recipient: {
      name: 'Oliver Thorne',
      company: 'Thorne & Company Design Studio',
      address: '42 Shoreditch High Street, London EC2A 4NE, UK',
      phone: '+44 20 7946 0912',
    },
    cargo: {
      pieces: 1,
      weightKg: 3.4,
      volumeCbm: 0.015,
      description: 'Designer Ceramic Artwork & Exhibition Catalogs',
      declaredValueUsd: 1250,
    },
    telemetry: {
      flightVesselNumber: 'D11 Eco-Electric Sprinter #UK-19',
      airwayBill: 'AWB-111-3011-2041',
      estimatedArrival: 'Delivered Successfully',
    },
    proofOfDelivery: {
      deliveredAt: 'Sep 02, 2026 - 11:24 BST',
      receivedBy: 'O. Thorne (Signed via Handheld Tablet)',
      signatureText: 'Oliver Thorne - Front Reception Desk',
    },
    checkpoints: [
      {
        id: 'cp-del-5',
        timestamp: 'Sep 02, 2026 - 11:24 BST',
        status: 'Delivered',
        location: 'London EC2A 4NE',
        description: 'Package delivered safely to recipient. Proof of Delivery signature archived.',
        isCompleted: true,
      },
      {
        id: 'cp-del-4',
        timestamp: 'Sep 02, 2026 - 08:30 BST',
        status: 'Out for Delivery',
        location: 'London Shoreditch Route',
        description: 'Out for delivery with driver Arthur Campbell.',
        isCompleted: true,
      },
      {
        id: 'cp-del-3',
        timestamp: 'Sep 01, 2026 - 19:10 BST',
        status: 'Import Cleared',
        location: 'London Heathrow (LHR)',
        description: 'UK Border Force clearance expedited via Double 11 automated green lane.',
        isCompleted: true,
      },
      {
        id: 'cp-del-2',
        timestamp: 'Aug 31, 2026 - 22:00 HKT',
        status: 'In Flight',
        location: 'Hong Kong -> London Air Corridor',
        description: 'Direct freight charter D11-008 departed HKG.',
        isCompleted: true,
      },
      {
        id: 'cp-del-1',
        timestamp: 'Aug 30, 2026 - 14:00 HKT',
        status: 'Picked Up',
        location: 'Shenzhen Hub',
        description: 'Order processed by high-speed AGV robotic fulfillment unit #42.',
        isCompleted: true,
      },
    ],
  },
];

const STORAGE_KEY = 'double11_shipments_v1';

export function getShipments(): Shipment[] {
  if (typeof window === 'undefined') return INITIAL_SHIPMENTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SHIPMENTS));
      return INITIAL_SHIPMENTS;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_SHIPMENTS;
  }
}

export function getShipmentById(id: string): Shipment | undefined {
  const shipments = getShipments();
  const cleanId = id.trim().toUpperCase();
  return shipments.find(s => s.id.toUpperCase() === cleanId);
}

export function createShipment(data: Partial<Shipment>): Shipment {
  const current = getShipments();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const code = data.serviceCode || 'EXP';
  const newId = `D11-${randomNum}-${code}`;

  const now = new Date().toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newShipment: Shipment = {
    id: newId,
    service: data.service || 'Double 11 Super Express',
    serviceCode: code,
    status: 'Pending Pickup',
    origin: data.origin || { city: 'Shenzhen', country: 'CHN', hub: 'Shenzhen Mega Hub' },
    destination: data.destination || { city: 'New York', country: 'USA', hub: 'JFK Hub', postalCode: '10001' },
    sender: data.sender || { name: 'Customer Consignor', company: 'Self', phone: '+1 000 000 0000' },
    recipient: data.recipient || { name: 'Receiver', company: 'Personal', address: 'City Center', phone: '+1 000 000 0000' },
    cargo: data.cargo || { pieces: 1, weightKg: 2.5, volumeCbm: 0.01, description: 'E-commerce Merchandise', declaredValueUsd: 250 },
    telemetry: {
      flightVesselNumber: 'D11-Express Dispatch Unit',
      airwayBill: `AWB-111-${randomNum}-${Math.floor(1000 + Math.random() * 9000)}`,
      estimatedArrival: 'In 2-3 Business Days',
      temperatureCelsius: 21.0,
    },
    checkpoints: [
      {
        id: `cp-${Date.now()}`,
        timestamp: `${now}`,
        status: 'Order Placed',
        location: `${data.origin?.city || 'Shenzhen'} Dispatch Terminal`,
        description: 'Booking confirmed online. Waybill and barcode issued. Awaiting courier collection.',
        isCompleted: true,
      },
    ],
  };

  const updated = [newShipment, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newShipment;
}

export function updateShipmentStatus(
  id: string,
  newStatus: Shipment['status'],
  location: string,
  note: string
): Shipment | null {
  const current = getShipments();
  const index = current.findIndex(s => s.id.toUpperCase() === id.toUpperCase());
  if (index === -1) return null;

  const now = new Date().toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const updatedShipment = { ...current[index] };
  updatedShipment.status = newStatus;

  let checkpointStatus: Checkpoint['status'] = 'Hub Received';
  if (newStatus === 'Out for Delivery') checkpointStatus = 'Out for Delivery';
  else if (newStatus === 'Delivered') {
    checkpointStatus = 'Delivered';
    updatedShipment.proofOfDelivery = {
      deliveredAt: now,
      receivedBy: `${updatedShipment.recipient.name} (Direct Signature)`,
      signatureText: `${updatedShipment.recipient.name} - Electronic POD`,
    };
  } else if (newStatus === 'Customs Cleared') checkpointStatus = 'Import Cleared';
  else if (newStatus === 'In Transit') checkpointStatus = 'In Flight';

  const newCheckpoint: Checkpoint = {
    id: `cp-${Date.now()}`,
    timestamp: now,
    status: checkpointStatus,
    location: location || updatedShipment.destination.city,
    description: note || `Shipment status updated to: ${newStatus}`,
    isCompleted: true,
  };

  updatedShipment.checkpoints = [newCheckpoint, ...updatedShipment.checkpoints];
  current[index] = updatedShipment;

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }

  return updatedShipment;
}

export interface QuoteRequest {
  originCountry: string;
  destCountry: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  goodsType: string;
}

export interface RateOption {
  serviceName: string;
  serviceCode: 'EXP' | 'AIR' | 'SEA' | 'FUL';
  transitDays: string;
  estimatedCostUsd: number;
  carrierType: string;
  features: string[];
  recommended?: boolean;
}

export function calculateFreightRate(params: QuoteRequest): RateOption[] {
  const volumetricWeight = (params.lengthCm * params.widthCm * params.heightCm) / 5000;
  const chargeableWeight = Math.max(params.weightKg, volumetricWeight, 1);

  // Multiplier based on destination
  let regionFactor = 1.0;
  if (params.destCountry === 'USA' || params.destCountry === 'CAN') regionFactor = 1.25;
  else if (params.destCountry === 'GBR' || params.destCountry === 'DEU' || params.destCountry === 'FRA') regionFactor = 1.35;
  else if (params.destCountry === 'AUS' || params.destCountry === 'NZL') regionFactor = 1.4;

  const baseRateExp = 28 + chargeableWeight * 8.5 * regionFactor;
  const baseRateAir = 18 + chargeableWeight * 5.8 * regionFactor;
  const baseRateSea = 65 + (chargeableWeight > 50 ? chargeableWeight * 0.9 : 45);
  const baseRateSaver = 12 + chargeableWeight * 4.2 * regionFactor;

  return [
    {
      serviceName: 'Double 11 Super Express',
      serviceCode: 'EXP',
      transitDays: '1 - 2 Business Days',
      estimatedCostUsd: Math.round(baseRateExp),
      carrierType: 'Dedicated Air Cargo Jet (Boeing 777F)',
      features: ['Priority customs clearance', 'Guaranteed departure window', 'Active temperature & GPS telemetry', '24/7 Dedicated dispatch agent'],
      recommended: true,
    },
    {
      serviceName: 'Cross-Border Air Priority',
      serviceCode: 'AIR',
      transitDays: '3 - 4 Business Days',
      estimatedCostUsd: Math.round(baseRateAir),
      carrierType: 'Commercial Scheduled Air Freight',
      features: ['Automated milestone tracking', 'Standard insurance included', 'Door-to-door delivery', 'Customs import filing'],
    },
    {
      serviceName: 'Double 11 Peak Saver',
      serviceCode: 'FUL',
      transitDays: '5 - 7 Business Days',
      estimatedCostUsd: Math.round(baseRateSaver),
      carrierType: 'Consolidated Air & Ground Network',
      features: ['Best value for e-commerce parcels', 'Smart warehouse robotic dispatch', 'Full online tracking'],
    },
    {
      serviceName: 'Ocean Container FCL / LCL',
      serviceCode: 'SEA',
      transitDays: '14 - 22 Ocean Transit Days',
      estimatedCostUsd: Math.round(baseRateSea),
      carrierType: 'Ultra-Large Container Vessel',
      features: ['Ideal for heavy bulk cargo (>50kg)', 'Port-to-port or door-to-door', 'Marine cargo protection'],
    },
  ];
}

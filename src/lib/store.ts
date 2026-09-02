export interface Checkpoint {
  id: string;
  timestamp: string;
  status: 'Order Placed' | 'Picked Up' | 'Hub Received' | 'Export Cleared' | 'In Flight' | 'At Sea' | 'In Transit' | 'Import Cleared' | 'Customs Cleared' | 'Out for Delivery' | 'Delivered' | 'Delayed';
  location: string;
  description: string;
  isCompleted: boolean;
}

export interface Shipment {
  id: string;
  service: string;
  serviceCode: 'EXP' | 'CARGO' | 'RUSH' | 'INTL' | 'AIR' | 'SEA' | 'FUL';
  isInternational?: boolean;
  status: 'In Transit' | 'Out for Delivery' | 'Customs Cleared' | 'Delivered' | 'Pending Pickup' | 'Exception';
  origin: {
    city: string;
    province?: string;
    country?: string;
    hub: string;
  };
  destination: {
    city: string;
    province?: string;
    country?: string;
    hub: string;
    areaCode?: string;
    postalCode?: string;
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
    declaredValueNpr?: number;
    declaredValueUsd?: number;
    hazardClass?: string;
  };
  telemetry: {
    transportVehicle?: string;
    flightVesselNumber?: string;
    waybillNumber?: string;
    airwayBill?: string;
    trackingRoute?: string;
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
    id: 'D11-8892-KTM',
    service: 'Double 11 Nepal Express',
    serviceCode: 'EXP',
    status: 'In Transit',
    origin: {
      city: 'Kathmandu',
      province: 'Bagmati Province',
      hub: 'Kathmandu Central Mega-Hub (TIA Cargo Gate)',
    },
    destination: {
      city: 'Pokhara',
      province: 'Gandaki Province',
      hub: 'Pokhara Lake City Distribution Hub',
      areaCode: '33700',
    },
    sender: {
      name: 'Himalayan Electronics Nepal',
      company: 'Apex Tech Nepal Pvt Ltd',
      phone: '+977 98012 34567',
    },
    recipient: {
      name: 'Pradeep Gurung',
      company: 'Annapurna IT Solutions',
      address: 'Lakeside Ward No. 6, Pokhara, Gandaki, Nepal',
      phone: '+977 98460 11223',
    },
    cargo: {
      pieces: 3,
      weightKg: 8.5,
      volumeCbm: 0.045,
      description: 'Smart Handheld Scanners & 5G Modem Routers',
      declaredValueNpr: 145000,
    },
    telemetry: {
      transportVehicle: 'D11 Express Electric Van #BA-2-PA-8892',
      waybillNumber: 'AWB-D11-NP-8892',
      trackingRoute: 'Prithvi Highway High-Speed Route',
      estimatedArrival: 'Today at 16:30 NPT',
      temperatureCelsius: 22.1,
      currentSpeedKmh: 68,
    },
    checkpoints: [
      {
        id: 'cp-ktm-4',
        timestamp: 'Sep 02, 2026 - 11:30 NPT',
        status: 'In Transit',
        location: 'Mugling Transit Gateway',
        description: 'En route along Prithvi Corridor with GPS telemetry & thermal monitoring active.',
        isCompleted: true,
      },
      {
        id: 'cp-ktm-3',
        timestamp: 'Sep 02, 2026 - 08:45 NPT',
        status: 'Hub Received',
        location: 'Kathmandu Central Mega-Hub',
        description: 'Automated barcode sorting and weight audit complete. Loaded to Express Courier Van.',
        isCompleted: true,
      },
      {
        id: 'cp-ktm-2',
        timestamp: 'Sep 02, 2026 - 07:15 NPT',
        status: 'Picked Up',
        location: 'New Road Commercial Hub, Kathmandu',
        description: 'Double 11 Rider collected parcel directly from merchant warehouse.',
        isCompleted: true,
      },
      {
        id: 'cp-ktm-1',
        timestamp: 'Sep 01, 2026 - 21:00 NPT',
        status: 'Order Placed',
        location: 'Double 11 Digital Portal',
        description: 'Consignment booked online. Digital waybill issued.',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'D11-4410-BIRT',
    service: 'Nationwide Hub Cargo',
    serviceCode: 'CARGO',
    status: 'Out for Delivery',
    origin: {
      city: 'Birgunj',
      province: 'Madhesh Province',
      hub: 'Birgunj Inland Dry Port Terminal',
    },
    destination: {
      city: 'Biratnagar',
      province: 'Koshi Province',
      hub: 'Biratnagar Eastern Industrial Hub',
      areaCode: '56613',
    },
    sender: {
      name: 'Terai Supply Chain Logistics',
      company: 'Double 11 South Corridor Branch',
      phone: '+977 98112 88990',
    },
    recipient: {
      name: 'Sunita Sharma',
      company: 'Koshi Agro-Industrial Trade',
      address: 'Main Road Ward No. 4, Biratnagar, Koshi, Nepal',
      phone: '+977 98020 99881',
    },
    cargo: {
      pieces: 12,
      weightKg: 240,
      volumeCbm: 1.2,
      description: 'Industrial Precision Hardware, Pumps & Fittings',
      declaredValueNpr: 480000,
    },
    telemetry: {
      transportVehicle: 'D11 Heavy Freight Carrier #NA-5-KHA-4410',
      waybillNumber: 'AWB-D11-NP-4410',
      trackingRoute: 'East-West Highway (Mahendra Highway)',
      estimatedArrival: 'Today at 14:00 NPT',
      currentSpeedKmh: 55,
    },
    checkpoints: [
      {
        id: 'cp-brt-3',
        timestamp: 'Sep 02, 2026 - 10:15 NPT',
        status: 'Out for Delivery',
        location: 'Biratnagar Hub Distribution Line',
        description: 'Assigned to delivery pilot Ramesh Karki. Out for final delivery to recipient premises.',
        isCompleted: true,
      },
      {
        id: 'cp-brt-2',
        timestamp: 'Sep 02, 2026 - 05:30 NPT',
        status: 'Hub Received',
        location: 'Itahari Regional Transit Center',
        description: 'Cross-docking completed. Transferred to Biratnagar delivery unit.',
        isCompleted: true,
      },
      {
        id: 'cp-brt-1',
        timestamp: 'Sep 01, 2026 - 16:00 NPT',
        status: 'Picked Up',
        location: 'Birgunj Dry Port Customs Zone',
        description: 'Bulk consignment secured with GPS tamper-proof e-seal.',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'D11-9921-CHIT',
    service: 'Same-Day Valley Rush',
    serviceCode: 'RUSH',
    status: 'Delivered',
    origin: {
      city: 'Lalitpur',
      province: 'Bagmati Province',
      hub: 'Patan High-Tech Fulfillment Hub',
    },
    destination: {
      city: 'Bharatpur',
      province: 'Bagmati Province',
      hub: 'Chitwan Narayangarh Gateway',
      areaCode: '44200',
    },
    sender: {
      name: 'Double 11 Central Fulfillment',
      company: 'Double 11 Express Nepal',
      phone: '+977 1 5522001',
    },
    recipient: {
      name: 'Bibek Adhikari',
      company: 'Chitwan Medical Supplies',
      address: 'Lions Chowk, Narayangarh, Bharatpur, Chitwan',
      phone: '+977 98550 12345',
    },
    cargo: {
      pieces: 2,
      weightKg: 4.2,
      volumeCbm: 0.02,
      description: 'Emergency Medical Diagnostic Kits & Optics',
      declaredValueNpr: 85000,
    },
    telemetry: {
      transportVehicle: 'D11 Swift Electric Van #BA-1-JHA-9921',
      waybillNumber: 'AWB-D11-NP-9921',
      trackingRoute: 'Kathmandu-Mugling-Narayangarh Express Lane',
      estimatedArrival: 'Delivered Successfully',
    },
    proofOfDelivery: {
      deliveredAt: 'Sep 02, 2026 - 10:45 NPT',
      receivedBy: 'Bibek Adhikari (Verified via Handheld App)',
      signatureText: 'Bibek Adhikari - Narayangarh Clinic',
    },
    checkpoints: [
      {
        id: 'cp-chit-4',
        timestamp: 'Sep 02, 2026 - 10:45 NPT',
        status: 'Delivered',
        location: 'Lions Chowk, Narayangarh, Chitwan',
        description: 'Consignment handed over successfully. Digital proof of delivery verified.',
        isCompleted: true,
      },
      {
        id: 'cp-chit-3',
        timestamp: 'Sep 02, 2026 - 08:30 NPT',
        status: 'Out for Delivery',
        location: 'Bharatpur Central Station',
        description: 'Out for priority doorstep delivery with driver Manoj Shrestha.',
        isCompleted: true,
      },
      {
        id: 'cp-chit-2',
        timestamp: 'Sep 02, 2026 - 05:00 NPT',
        status: 'In Transit',
        location: 'Nagdhunga - Naubise Corridor',
        description: 'Departed Kathmandu Valley on early morning express run.',
        isCompleted: true,
      },
      {
        id: 'cp-chit-1',
        timestamp: 'Sep 01, 2026 - 20:00 NPT',
        status: 'Hub Received',
        location: 'Lalitpur Patan Hub',
        description: 'Package packaged and cleared for Same-Day priority dispatch.',
        isCompleted: true,
      },
    ],
  },
  {
    id: 'D11-INTL-11',
    service: 'International Cross-Border (Coming Soon)',
    serviceCode: 'INTL',
    isInternational: true,
    status: 'Customs Cleared',
    origin: {
      city: 'Kathmandu (TIA)',
      province: 'Nepal',
      hub: 'Tribhuvan International Airport Cargo Terminal',
    },
    destination: {
      city: 'Dubai / Global Gateways',
      province: 'UAE / Worldwide',
      hub: 'Dubai International Air Cargo Terminal',
      areaCode: 'DXB-01',
    },
    sender: {
      name: 'Soben (Double 11 Global)',
      company: 'Double 11 Logistics Nepal',
      phone: '+977 1 4411000',
    },
    recipient: {
      name: 'Global Enterprise Partner',
      company: 'International Cargo Network',
      address: 'Dubai South Aviation District, UAE',
      phone: '+971 4 800 1111',
    },
    cargo: {
      pieces: 1,
      weightKg: 10.0,
      volumeCbm: 0.05,
      description: 'International Air Freight Corridor Pilot Test Kit',
      declaredValueNpr: 250000,
    },
    telemetry: {
      transportVehicle: 'International Boeing 777F Charter Corridor',
      waybillNumber: 'AWB-D11-INTL-001',
      trackingRoute: 'TIA (KTM) to DXB / HKG Corridor',
      estimatedArrival: 'Official International Launch: Coming Soon (Q4 2026)',
    },
    checkpoints: [
      {
        id: 'cp-intl-2',
        timestamp: 'Sep 02, 2026 - 12:00 NPT',
        status: 'Customs Cleared',
        location: 'Kathmandu TIA Air Cargo Complex',
        description: 'Nepal Customs pre-clearance validation successful for international flight lanes.',
        isCompleted: true,
      },
      {
        id: 'cp-intl-1',
        timestamp: 'Sep 01, 2026 - 15:00 NPT',
        status: 'Order Placed',
        location: 'Double 11 Global Expansion Division',
        description: 'Corridor pilot initiated. International services launching soon for all Nepal businesses.',
        isCompleted: true,
      },
    ],
  },
];

const STORAGE_KEY = 'double11_shipments_nepal_v1';

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
    service: data.service || 'Double 11 Nepal Express',
    serviceCode: code,
    status: 'Pending Pickup',
    origin: data.origin || { city: 'Kathmandu', province: 'Bagmati Province', hub: 'Kathmandu Central Hub' },
    destination: data.destination || { city: 'Pokhara', province: 'Gandaki Province', hub: 'Pokhara Regional Hub', areaCode: '33700' },
    sender: data.sender || { name: 'Verified Merchant', company: 'Nepal Business', phone: '+977 98000 00000' },
    recipient: data.recipient || { name: 'Customer Receiver', company: 'Personal', address: 'City Road', phone: '+977 98000 00000' },
    cargo: data.cargo || { pieces: 1, weightKg: 2.0, volumeCbm: 0.01, description: 'E-Commerce Consignment', declaredValueNpr: 5000 },
    telemetry: {
      transportVehicle: 'D11 Swift Electric Dispatch Unit',
      waybillNumber: `AWB-D11-NP-${randomNum}`,
      trackingRoute: `${data.origin?.city || 'Kathmandu'} to ${data.destination?.city || 'Pokhara'} Express Corridor`,
      estimatedArrival: 'Next Business Day (by 17:00 NPT)',
      temperatureCelsius: 21.5,
    },
    checkpoints: [
      {
        id: `cp-${Date.now()}`,
        timestamp: `${now}`,
        status: 'Order Placed',
        location: `${data.origin?.city || 'Kathmandu'} Dispatch Center`,
        description: 'Consignment confirmed online. Digital waybill issued. Rider assigned for collection.',
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
      signatureText: `${updatedShipment.recipient.name} - Electronic POD Handheld`,
    };
  } else if (newStatus === 'Customs Cleared') checkpointStatus = 'Import Cleared';
  else if (newStatus === 'In Transit') checkpointStatus = 'In Transit';

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
  originCity: string;
  destCity: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  isInternational?: boolean;
}

export interface DomesticRateOption {
  serviceName: string;
  serviceCode: 'EXP' | 'CARGO' | 'RUSH' | 'INTL';
  transitDays: string;
  estimatedCostNpr: number;
  isComingSoon?: boolean;
  carrierType: string;
  features: string[];
  recommended?: boolean;
}

export function calculateDomesticFreightRate(params: QuoteRequest): DomesticRateOption[] {
  const volumetricWeight = (params.lengthCm * params.widthCm * params.heightCm) / 5000;
  const chargeableWeight = Math.max(params.weightKg, volumetricWeight, 1);

  // Valley vs Outstation calculation
  const isValley =
    (params.originCity === 'Kathmandu' || params.originCity === 'Lalitpur' || params.originCity === 'Bhaktapur') &&
    (params.destCity === 'Kathmandu' || params.destCity === 'Lalitpur' || params.destCity === 'Bhaktapur');

  const baseExpress = isValley ? 120 + (chargeableWeight - 1) * 40 : 220 + (chargeableWeight - 1) * 70;
  const baseCargo = isValley ? 90 + chargeableWeight * 25 : 160 + chargeableWeight * 45;
  const baseRush = isValley ? 250 + (chargeableWeight - 1) * 50 : 390 + (chargeableWeight - 1) * 90;

  return [
    {
      serviceName: 'Double 11 Nepal Express',
      serviceCode: 'EXP',
      transitDays: isValley ? 'Same-Day (within 6 hrs)' : 'Next-Day (24 hrs Guaranteed)',
      estimatedCostNpr: Math.round(baseExpress),
      carrierType: 'Dedicated High-Speed Electric Fleet & Highway Linehaul',
      features: ['Real-time GPS rider tracking', 'Free Doorstep Pickup', '100% On-Time SLA Guarantee', 'Automated SMS alerts to recipient'],
      recommended: true,
    },
    {
      serviceName: 'Nationwide Hub Cargo',
      serviceCode: 'CARGO',
      transitDays: '2 - 3 Days Nationwide (All 7 Provinces)',
      estimatedCostNpr: Math.round(baseCargo),
      carrierType: 'Inter-Provincial Heavy Freight Network',
      features: ['Best for bulk parcels & B2B stock', 'Secure warehouse buffering', 'Full waybill tracking across all 77 districts'],
    },
    {
      serviceName: 'Same-Day Valley Rush',
      serviceCode: 'RUSH',
      transitDays: 'Under 3 Hours (Kathmandu, Lalitpur, Bhaktapur)',
      estimatedCostNpr: Math.round(baseRush),
      carrierType: 'Instant Dedicated Electric Two-Wheeler / Van Fleet',
      features: ['Direct point-to-point courier', 'Urgent medical, documents & food orders', 'Instant digital POD with photo'],
    },
    {
      serviceName: 'International Cross-Border Cargo',
      serviceCode: 'INTL',
      transitDays: 'Coming Soon (Launching Q4 2026)',
      estimatedCostNpr: 0,
      isComingSoon: true,
      carrierType: 'Tribhuvan Airport (TIA) Direct Cargo Flights to Global Hubs',
      features: ['Export customs pre-clearance with Nepal Customs', 'Direct connections to India, China, UAE & US/EU', 'Register your business for early access'],
    },
  ];
}

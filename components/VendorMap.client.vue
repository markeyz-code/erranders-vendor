<template>
  <div class="relative w-full h-[500px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 group">
    <!-- Map Container -->
    <div ref="mapContainer" class="w-full h-full z-0"></div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm font-bold text-slate-700">Loading Map...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  vendors: {
    type: Array as () => any[],
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  hoveredVendorId: {
    type: String,
    default: null
  }
})

let map: L.Map | null = null
let markersGroup: L.LayerGroup | null = null
const mapContainer = ref<HTMLElement | null>(null)

// Center on UNILAG roughly
const defaultCenter: L.LatLngExpression = [6.518, 3.398]
const defaultZoom = 14

const initMap = () => {
  if (map || !mapContainer.value) return

  map = L.map(mapContainer.value, {
    center: defaultCenter,
    zoom: defaultZoom,
    zoomControl: false,
    scrollWheelZoom: false // Keep scrolling smooth on landing page
  })

  // Add sleek CartoDB light tiles matching the minimalist aesthetic
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map)

  // Custom Zoom Control position
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  markersGroup = L.layerGroup().addTo(map)
  updateMarkers()
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    restaurant: '🍽️',
    salon: '💇‍♀️',
    groceries: '🛒',
    services: '🎓'
  }
  return icons[category?.toLowerCase()] || '📍'
}

const updateMarkers = () => {
  if (!map || !markersGroup) return
  markersGroup.clearLayers()

  const bounds = L.latLngBounds([])

  props.vendors.forEach(vendor => {
    const coords = vendor.location?.coordinates
    if (coords && coords.length === 2 && coords[0] !== 0 && coords[1] !== 0) {
      const latLng: L.LatLngExpression = [coords[1], coords[0]]
      const emoji = getCategoryIcon(vendor.category)
      const isHovered = props.hoveredVendorId === vendor._id
      
      const icon = L.divIcon({
        className: 'custom-vendor-marker',
        html: `<div class="w-10 h-10 bg-white rounded-full border-[3px] shadow-lg flex items-center justify-center text-xl transition-all duration-300 ease-out z-10 ${isHovered ? 'scale-125 border-[#FF5C1A] shadow-xl !z-50 -translate-y-2' : 'border-slate-900 hover:scale-110 hover:border-[#FF5C1A] hover:z-50'}">${emoji}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      })

      const marker = L.marker(latLng, { icon })
      
      const popupHtml = `
        <div class="p-1 font-sans">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-12 h-12 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
               <img src="${vendor.image || vendor.logo || vendor.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80'}" class="w-full h-full object-cover" />
            </div>
            <div>
              <h4 class="font-extrabold text-slate-900 text-[15px] leading-tight m-0">${vendor.storeName}</h4>
              <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1 m-0">${vendor.category || 'Store'}</p>
            </div>
          </div>
          <p class="text-sm text-slate-600 mb-0 font-medium">${vendor.description ? vendor.description.substring(0, 50) + '...' : 'Available on Errander'}</p>
        </div>
      `
      
      marker.bindPopup(popupHtml, {
        className: 'sleek-popup',
        minWidth: 200
      })
      
      markersGroup.addLayer(marker)
      bounds.extend(latLng)
    }
  })

  // Fit map to markers if there are any, else use default center
  if (bounds.isValid() && props.vendors.length > 0) {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
  } else {
    map.setView(defaultCenter, defaultZoom)
  }
}

watch([() => props.vendors, () => props.hoveredVendorId], () => {
  updateMarkers()
}, { deep: true })

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
/* Leaflet Global Style Overrides */
.sleek-popup .leaflet-popup-content-wrapper {
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border: 1px solid #f1f5f9;
}
.sleek-popup .leaflet-popup-content {
  margin: 12px;
}
.sleek-popup .leaflet-popup-tip {
  box-shadow: none;
  border-right: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}
</style>

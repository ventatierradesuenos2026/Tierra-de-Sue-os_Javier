const lotGallery = [
  "assets/propiedades/lotes-san-isidro/fotos/img_01.jpeg",
  "assets/propiedades/lotes-san-isidro/fotos/img_02.jpeg",
  "assets/propiedades/lotes-san-isidro/fotos/img_03.jpeg",
  "assets/propiedades/lotes-san-isidro/fotos/img_04.jpeg",
  "assets/propiedades/lotes-san-isidro/fotos/img_05.jpeg",
  "assets/propiedades/lotes-san-isidro/fotos/img_06.jpeg",
  "assets/propiedades/lotes-san-isidro/fotos/imag_07.jpeg",
  "assets/propiedades/lotes-san-isidro/fotos/imag_07.jpeg"
];
const houseGallery = [
  "assets/casa-parques-de-bolivar/fotos/casa_parques_de_bolivar_foto_01.jpg",
  "assets/casa-parques-de-bolivar/fotos/casa_parques_de_bolivar_foto_02.jpg",
  "assets/casa-parques-de-bolivar/fotos/casa_parques_de_bolivar_foto_03.jpg",
  "assets/casa-parques-de-bolivar/fotos/casa_parques_de_bolivar_foto_04.jpg",
  "assets/casa-parques-de-bolivar/fotos/WhatsApp Image 2026-10-25 at 5.00.00 PM.jpeg"
];
const galleryData = {
  lot: {photos: lotGallery, index: 0, label: "Lote medianero · San Isidro"},
  corner: {photos: lotGallery, index: 1, label: "Lote esquinero · San Isidro"},
  house: {photos: houseGallery, index: 0, label: "Casa · Parques de Bolívar"}
};
const list = document.getElementById("listingList");
const rows = Array.from(document.querySelectorAll("#listingList .property-row"));
const count = document.getElementById("resultsCount");
const empty = document.getElementById("emptyState");
const searchForm = document.getElementById("searchForm");
const locationFilter = document.getElementById("locationFilter");
const typeFilter = document.getElementById("typeFilter");
const priceFilter = document.getElementById("priceFilter");
const sortFilter = document.getElementById("sortFilter");
const clearButton = document.getElementById("clearFilters");
const clearEmptyButton = document.getElementById("clearFiltersEmpty");

function refreshCount() {
  const visibleCount = rows.filter(row => !row.hidden).length;
  if (count) count.textContent = `${visibleCount} ${visibleCount === 1 ? "propiedad disponible" : "propiedades disponibles"} en Cúcuta`;
  if (empty) empty.hidden = visibleCount !== 0;
}

function sortRows() {
  if (!list || !sortFilter) return;
  const mode = sortFilter.value;
  const ordered = [...rows].sort((a, b) => {
    const priceA = Number(a.dataset.price || 0);
    const priceB = Number(b.dataset.price || 0);
    if (mode === "low") return priceA - priceB;
    if (mode === "high") return priceB - priceA;
    return rows.indexOf(a) - rows.indexOf(b);
  });
  ordered.forEach(row => list.appendChild(row));
}

function applyFilters(event) {
  if (event) event.preventDefault();
  const location = locationFilter ? locationFilter.value : "all";
  const type = typeFilter ? typeFilter.value : "all";
  const price = priceFilter ? priceFilter.value : "all";
  rows.forEach(row => {
    const matchesLocation = location === "all" || row.dataset.location === location;
    const matchesType = type === "all" || row.dataset.type === type;
    const matchesPrice = price === "all" || Number(row.dataset.price || 0) <= Number(price);
    // Usar el atributo hidden evita que el estilo de las tarjetas anule el filtro.
    const shouldShow = matchesLocation && matchesType && matchesPrice;
    row.hidden = !shouldShow;
    // El CSS anterior de la tarjeta puede sobrescribir [hidden]; !important lo evita.
    if (shouldShow) {
      row.style.removeProperty("display");
    } else {
      row.style.setProperty("display", "none", "important");
    }
  });
  sortRows();
  refreshCount();
}

function clearFilters(event) {
  if (event) event.preventDefault();
  if (locationFilter) locationFilter.value = "all";
  if (typeFilter) typeFilter.value = "all";
  if (priceFilter) priceFilter.value = "all";
  if (sortFilter) sortFilter.value = "recommended";
  applyFilters();
}

// Registrar una sola acción para cada botón y evitar recargas del formulario.
if (searchForm) searchForm.addEventListener("submit", applyFilters);
if (sortFilter) sortFilter.addEventListener("change", () => { sortRows(); refreshCount(); });
if (clearButton) clearButton.addEventListener("click", clearFilters);
if (clearEmptyButton) clearEmptyButton.addEventListener("click", clearFilters);

// Al abrir la página se muestran todos los inmuebles.
applyFilters();

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.dataset.next, data = galleryData[key];
    data.index = (data.index + 1) % data.photos.length;
    const img = document.querySelector(`[data-gallery="${key}"]`);
    img.src = data.photos[data.index];
    img.onerror = () => { img.style.display = "none"; img.closest(".property-media").classList.add("image-missing"); };
    img.style.display = "block";
  });
});

const modal = document.getElementById("detailsModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
function openDetails(key) {
  modalContent.innerHTML = "";
  if (key === "house") {
    modalTitle.textContent = "Casa en Parques de Bolívar";
    const note = document.createElement("p"); note.className = "modal-note"; note.textContent = "Fotos disponibles en la carpeta de la propiedad. El video puede consultarse con el asesor por WhatsApp.";
    modalContent.appendChild(note);
    const video = document.createElement("video"); video.className = "modal-video"; video.controls = true; video.preload = "metadata";
    const source = document.createElement("source"); source.src = "assets/casa-parques-de-bolivar/videos/vid_02.mp4"; source.type = "video/mp4"; video.appendChild(source);
    video.addEventListener("error", () => { video.style.display = "none"; });
    modalContent.appendChild(video);
  } else {
    modalTitle.textContent = key === "lot" ? "Lote medianero en San Isidro" : "Lote esquinero en San Isidro";
    const gallery = document.createElement("div"); gallery.className = "modal-gallery";
    const photos = lotGallery.slice(0,7);
    photos.forEach(path => { const img = document.createElement("img"); img.src = path; img.alt = "Fotografía de lote en San Isidro"; img.onerror = () => img.style.display = "none"; gallery.appendChild(img); });
    modalContent.appendChild(gallery);
    const plan = document.createElement("img"); plan.className = "modal-plan"; plan.src = "assets/propiedades/lotes-san-isidro/planos/plano_01.png"; plan.alt = "Plano del proyecto San Isidro";
    plan.onerror = () => plan.style.display = "none";
    const title = document.createElement("h3"); title.textContent = "Plano del proyecto"; title.style.color = "var(--green)";
    modalContent.appendChild(title); modalContent.appendChild(plan);
  }
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden";
}
function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; }
document.querySelectorAll("[data-details]").forEach(button => button.addEventListener("click", () => openDetails(button.dataset.details)));
document.querySelectorAll("[data-close-modal]").forEach(button => button.addEventListener("click", closeModal));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("mainNav").classList.toggle("open"));
refreshCount();

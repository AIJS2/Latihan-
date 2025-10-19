// ===========================================
//      LOGIC SLIDER FISIKA (FINAL VERSION)
// (Hanya Aktif Jika Diklik di Slider)
// ===========================================
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider");
  const handle = document.querySelector(".slider-handle");

  // Variabel Fisika
  let handleX = 0; // Posisi handle saat ini
  let velocityX = 0; // Kecepatan handle
  let isDragging = false;
  let restingX = 0; // Posisi 'diam' handle
  let dragStartX = 0; // Posisi awal mouse saat drag dimulai

  // Konstanta Fisika
  const springStiffness = 0.08;
  const friction = 0.85;

  // --- Event Listeners (INI BAGIAN PALING PENTING) ---

  // 1. MULAI DRAG: Hanya jika mouse ditekan DI ATAS AREA SLIDER
  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    // Hitung offset agar handle tidak 'lompat' ke posisi mouse
    dragStartX = e.clientX - handleX;
  });
  slider.addEventListener("touchstart", (e) => {
    isDragging = true;
    dragStartX = e.touches[0].clientX - handleX;
  });

  // 2. BERHENTI DRAG: Jika mouse dilepas DI MANA SAJA DI WINDOW
  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    restingX = handleX; // Kunci posisi diam
  });
  window.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    restingX = handleX;
  });

  // 3. SAAT MENGGESER: Lacak mouse DI MANA SAJA DI WINDOW
  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      // Targetnya adalah posisi mouse dikurangi offset awal
      const targetX = e.clientX - dragStartX;

      // Logika fisika untuk menggerakkan handle ke target
      const force = (targetX - handleX) * springStiffness;
      velocityX += force;
    }
  });
  window.addEventListener("touchmove", (e) => {
    if (isDragging) {
      const targetX = e.touches[0].clientX - dragStartX;
      const force = (targetX - handleX) * springStiffness;
      velocityX += force;
    }
  });

  // --- Loop Animasi Fisika ---
  function animate() {
    // Jika tidak di-drag, handle akan mencoba diam di posisi restingX
    if (!isDragging) {
      const force = (restingX - handleX) * springStiffness;
      velocityX += force;
    }

    // Terapkan friksi untuk meredam getaran
    velocityX *= friction;

    // Gerakkan handle berdasarkan kecepatannya
    handleX += velocityX;

    // Batasi gerakan di dalam track
    const handleWidth = handle.offsetWidth;
    const endPosition = slider.offsetWidth - handleWidth;
    if (handleX < 0) {
      handleX = 0;
      velocityX = 0; // Hentikan pantulan di batas
    }
    if (handleX > endPosition) {
      handleX = endPosition;
      velocityX = 0; // Hentikan pantulan di batas
    }

    handle.style.transform = `translateX(${handleX}px) translateY(-50%)`;
    requestAnimationFrame(animate);
  }

  animate();
});

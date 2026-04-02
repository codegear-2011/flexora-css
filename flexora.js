// ==========================
// 🚀 FLEXORA JS v1.0
// ==========================

const Flexora = {

  // Modal
  openModal(id) {
    document.getElementById(id).style.display = "flex";
  },

  closeModal(id) {
    document.getElementById(id).style.display = "none";
  },

  // Dropdown
  toggleDropdown(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === "block" ? "none" : "block";
  },

  // Tabs
  openTab(id) {
    document.querySelectorAll(".fx-tab-content").forEach(tab => {
      tab.style.display = "none";
    });
    document.getElementById(id).style.display = "block";
  },

  // Theme
  setTheme(mode) {
    document.body.setAttribute("data-theme", mode);
  }

};
